import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';
import { validateBody } from '@/middleware/validation';
import { loginSchema } from '@/lib/validations';

const JWT_SECRET = process.env.JWT_SECRET || 'nthoppa-super-secret-jwt-key-2026-minimum-32-chars';

const DEMO_CREDENTIALS = {
  admin: { email: 'admin@nthoppa.com', password: 'admin123', name: 'System Administrator', id: 'admin-001' },
  agent: { email: 'agent@nthoppa.com', password: 'password123', name: 'John Doe', territory: 'Gaborone North', loginEmail: 'agent@nthoppa.com' },
  client: { email: 'client@nthoppa.com', password: 'client123', name: 'Josephine Morolong', id: 'client-demo-001' },
  hr: { email: 'hr@nthoppa.com', password: 'hr123', name: 'Thabo Molefe', id: 'hr-demo-001' },
  merchant: { email: 'merchant@nthoppa.com', password: 'merchant123', name: 'Kgabo General Store', id: 'merchant-demo-001' }
};

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
};

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { data: validated, error: validationError } = await validateBody(loginSchema)(request);
    
    if (validationError) {
      return validationError;
    }
    
    const { email, password, role } = validated;
    
    const rateLimitError = await checkRateLimit(request, email);
    if (rateLimitError) {
      return rateLimitError;
    }
    
    console.log('📝 Login attempt:', { email, role, timestamp: new Date().toISOString() });
    
    const createSuccessResponse = (userId: string, userEmail: string, userName: string, userRole: string, extraData: object = {}) => {
      const token = jwt.sign(
        { id: userId, email: userEmail, role: userRole, name: userName, ...extraData },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      const response = NextResponse.json({
        success: true,
        user: { id: userId, name: userName, email: userEmail, role: userRole, ...extraData },
        token,
        elapsedMs: Date.now() - startTime,
      });
      
      response.cookies.set('nthoppa_token', token, COOKIE_OPTIONS);
      response.cookies.set('user_role', userRole, COOKIE_OPTIONS);
      
      if (userRole === 'admin') {
        response.cookies.set('admin_session', token, COOKIE_OPTIONS);
      }
      
      return response;
    };
    
    if (role === 'admin') {
      if (email !== DEMO_CREDENTIALS.admin.email || password !== DEMO_CREDENTIALS.admin.password) {
        console.log('❌ Admin credentials invalid');
        return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
      }
      
      console.log('✅ Admin login successful');
      return createSuccessResponse(
        DEMO_CREDENTIALS.admin.id,
        email,
        DEMO_CREDENTIALS.admin.name,
        'admin'
      );
    }
    
    if (role === 'agent') {
      if ((email === DEMO_CREDENTIALS.agent.email || email === DEMO_CREDENTIALS.agent.loginEmail) && 
          password === DEMO_CREDENTIALS.agent.password) {
        console.log('✅ Agent login via demo credentials');
        return createSuccessResponse(
          'agent-demo-001',
          DEMO_CREDENTIALS.agent.email,
          DEMO_CREDENTIALS.agent.name,
          'agent',
          { territory: DEMO_CREDENTIALS.agent.territory }
        );
      }
      
      const agent = await prisma.agent.findFirst({
        where: { OR: [{ loginEmail: email }, { email: email }] }
      });
      
      if (!agent) {
        console.log('❌ Agent not found');
        return NextResponse.json({ error: 'Invalid agent credentials' }, { status: 401 });
      }
      
      let isValidPassword = false;
      if (agent.loginPassword) {
        if (agent.loginPassword.startsWith('$2')) {
          isValidPassword = await bcrypt.compare(password, agent.loginPassword);
        } else {
          isValidPassword = password === agent.loginPassword;
        }
      }
      
      if (!isValidPassword) {
        console.log('❌ Agent password invalid');
        return NextResponse.json({ error: 'Invalid agent credentials' }, { status: 401 });
      }
      
      if (agent.isActive === false) {
        console.log('❌ Agent account inactive');
        return NextResponse.json({ error: 'Agent account is deactivated' }, { status: 401 });
      }
      
      console.log('✅ Agent login successful from database');
      return createSuccessResponse(
        agent.id,
        agent.loginEmail,
        agent.name,
        'agent',
        { territory: agent.territory }
      );
    }
    
    if (role === 'client') {
      if (email === DEMO_CREDENTIALS.client.email && password === DEMO_CREDENTIALS.client.password) {
        console.log('✅ Client login via demo credentials');
        
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              fullName: DEMO_CREDENTIALS.client.name,
              email,
              phone: '+267 71 234 567',
              status: 'active',
              nthoppaCoins: 100,
              role: 'client',
            }
          });
          console.log('📝 Created demo client user:', user.id);
        }
        
        return createSuccessResponse(user.id, email, user.fullName, 'client');
      }
      
      const user = await prisma.user.findFirst({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: 'Invalid client credentials' }, { status: 401 });
      }
      
      return createSuccessResponse(user.id, user.email, user.fullName, 'client');
    }
    
    if (role === 'hr') {
      if (email === DEMO_CREDENTIALS.hr.email && password === DEMO_CREDENTIALS.hr.password) {
        console.log('✅ HR login successful');
        
        let hrUser = await prisma.user.findFirst({ where: { email } });
        if (!hrUser) {
          hrUser = await prisma.user.create({
            data: {
              fullName: DEMO_CREDENTIALS.hr.name,
              email,
              phone: '+267 72 345 678',
              status: 'active',
              role: 'hr',
            }
          });
          console.log('📝 Created HR user:', hrUser.id);
        }
        
        return createSuccessResponse(hrUser.id, email, hrUser.fullName, 'hr');
      }
      
      return NextResponse.json({ error: 'Invalid HR credentials' }, { status: 401 });
    }
    
    if (role === 'merchant') {
      if (email === DEMO_CREDENTIALS.merchant.email && password === DEMO_CREDENTIALS.merchant.password) {
        console.log('✅ Merchant login successful');
        
        let merchantUser = await prisma.user.findFirst({ where: { email } });
        if (!merchantUser) {
          merchantUser = await prisma.user.create({
            data: {
              fullName: DEMO_CREDENTIALS.merchant.name,
              email,
              phone: '+267 73 456 789',
              status: 'active',
              role: 'merchant',
            }
          });
          console.log('📝 Created merchant user:', merchantUser.id);
        }
        
        return createSuccessResponse(merchantUser.id, email, merchantUser.fullName, 'merchant');
      }
      
      return NextResponse.json({ error: 'Invalid merchant credentials' }, { status: 401 });
    }
    
    return NextResponse.json({ error: `Unknown role: ${role}` }, { status: 400 });
    
  } catch (error) {
    console.error('❌ Login API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}