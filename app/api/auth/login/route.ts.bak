import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';
import { validateBody } from '@/middleware/validation';
import { loginSchema } from '@/lib/validations';

const JWT_SECRET = process.env.JWT_SECRET || 'nthoppa-super-secret-jwt-key-2026-minimum-32-chars';

const DEMO_CREDENTIALS = {
  admin: { email: 'admin@nthoppa.com', password: 'admin123', name: 'System Administrator', id: 'admin-001', role: 'admin' },
  agent: { email: 'agent@nthoppa.com', password: 'agent123', name: 'John Motsumi', territory: 'Gaborone Central', role: 'agent' },
  client: { email: 'client@nthoppa.com', password: 'client123', name: 'Josephine Morolong', role: 'client' },
  hr: { email: 'hr@nthoppa.com', password: 'hr123', name: 'Thabo Molefe', role: 'hr' },
  merchant: { email: 'merchant@nthoppa.com', password: 'merchant123', name: 'Kgabo General Store', role: 'merchant' }
};

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
};

const getRedirectUrl = (role: string): string => {
  switch (role) {
    case 'admin': return '/admin/dashboard';
    case 'agent': return '/dashboard/main';
    case 'client': return '/client/dashboard';
    case 'hr': return '/hr/dashboard';
    case 'merchant': return '/merchant/dashboard';
    default: return '/';
  }
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
      const redirectUrl = getRedirectUrl(userRole);
      const token = jwt.sign(
        { id: userId, email: userEmail, role: userRole, name: userName, ...extraData },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      const response = NextResponse.json({
        success: true,
        redirectUrl,
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
    
    // Handle Admin login
    if (role === 'admin') {
      if (email !== DEMO_CREDENTIALS.admin.email || password !== DEMO_CREDENTIALS.admin.password) {
        return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
      }
      
      return createSuccessResponse(DEMO_CREDENTIALS.admin.id, email, DEMO_CREDENTIALS.admin.name, 'admin');
    }
    
    // Handle Agent login - SIMPLIFIED
    if (role === 'agent') {
      // Find agent by loginEmail or email
      const agent = await prisma.agent.findFirst({
        where: {
          OR: [
            { loginEmail: email },
            { email: email }
          ]
        }
      });
      
      console.log('Agent lookup result:', agent ? {
        id: agent.id,
        name: agent.name,
        loginEmail: agent.loginEmail,
        hasPassword: !!agent.loginPassword,
        isActive: agent.isActive
      } : 'NOT FOUND');
      
      if (!agent) {
        // If agent not found, create from demo credentials
        if (email === DEMO_CREDENTIALS.agent.email && password === DEMO_CREDENTIALS.agent.password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          const newAgent = await prisma.agent.create({
            data: {
              name: DEMO_CREDENTIALS.agent.name,
              email: DEMO_CREDENTIALS.agent.email,
              loginEmail: DEMO_CREDENTIALS.agent.email,
              loginPassword: hashedPassword,
              territory: DEMO_CREDENTIALS.agent.territory,
              isActive: true,
              nthoppaCoins: 0,
              streakDays: 0,
            }
          });
          console.log('Created new agent:', newAgent.id);
          return createSuccessResponse(newAgent.id, email, newAgent.name, 'agent', { territory: newAgent.territory });
        }
        return NextResponse.json({ error: 'Invalid agent credentials' }, { status: 401 });
      }
      
      if (!agent.isActive) {
        return NextResponse.json({ error: 'Agent account is deactivated' }, { status: 401 });
      }
      
      // Verify password
      let isValid = false;
      if (agent.loginPassword && agent.loginPassword.startsWith('$2')) {
        isValid = await bcrypt.compare(password, agent.loginPassword);
        console.log('Bcrypt compare result:', isValid);
      } else if (agent.loginPassword) {
        isValid = password === agent.loginPassword;
        console.log('Plain text compare result:', isValid);
      }
      
      if (!isValid) {
        console.log('Password invalid for agent:', agent.loginEmail);
        return NextResponse.json({ error: 'Invalid agent credentials' }, { status: 401 });
      }
      
      console.log('Agent login successful:', agent.loginEmail);
      return createSuccessResponse(agent.id, agent.loginEmail, agent.name, 'agent', { territory: agent.territory });
    }
    
    // Handle Client login
    if (role === 'client') {
      if (email === DEMO_CREDENTIALS.client.email && password === DEMO_CREDENTIALS.client.password) {
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              fullName: DEMO_CREDENTIALS.client.name,
              email,
              password: await bcrypt.hash(password, 10),
              phone: '+267 71 234 567',
              status: 'active',
              role: 'client',
              nthoppaCoins: 100,
              registrationDate: new Date(),
            }
          });
        }
        return createSuccessResponse(user.id, email, user.fullName, 'client');
      }
      
      const user = await prisma.user.findFirst({ where: { email, role: 'client' } });
      if (!user) {
        return NextResponse.json({ error: 'Invalid client credentials' }, { status: 401 });
      }
      
      if (user.password) {
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return NextResponse.json({ error: 'Invalid client credentials' }, { status: 401 });
        }
      }
      
      if (user.status !== 'active') {
        return NextResponse.json({ error: 'Account is deactivated' }, { status: 401 });
      }
      
      return createSuccessResponse(user.id, user.email, user.fullName, 'client');
    }
    
    // Handle HR login
    if (role === 'hr') {
      if (email === DEMO_CREDENTIALS.hr.email && password === DEMO_CREDENTIALS.hr.password) {
        let hrUser = await prisma.user.findFirst({ where: { email } });
        if (!hrUser) {
          hrUser = await prisma.user.create({
            data: {
              fullName: DEMO_CREDENTIALS.hr.name,
              email,
              password: await bcrypt.hash(password, 10),
              phone: '+267 72 345 678',
              status: 'active',
              role: 'hr',
              registrationDate: new Date(),
            }
          });
        }
        return createSuccessResponse(hrUser.id, email, hrUser.fullName, 'hr');
      }
      
      const hrUser = await prisma.user.findFirst({ where: { email, role: 'hr' } });
      if (!hrUser) {
        return NextResponse.json({ error: 'Invalid HR credentials' }, { status: 401 });
      }
      
      if (hrUser.password) {
        const isValid = await bcrypt.compare(password, hrUser.password);
        if (!isValid) {
          return NextResponse.json({ error: 'Invalid HR credentials' }, { status: 401 });
        }
      }
      
      return createSuccessResponse(hrUser.id, hrUser.email, hrUser.fullName, 'hr');
    }
    
    // Handle Merchant login
    if (role === 'merchant') {
      if (email === DEMO_CREDENTIALS.merchant.email && password === DEMO_CREDENTIALS.merchant.password) {
        let merchantUser = await prisma.user.findFirst({ where: { email } });
        if (!merchantUser) {
          merchantUser = await prisma.user.create({
            data: {
              fullName: DEMO_CREDENTIALS.merchant.name,
              email,
              password: await bcrypt.hash(password, 10),
              phone: '+267 73 456 789',
              status: 'active',
              role: 'merchant',
              registrationDate: new Date(),
            }
          });
        }
        return createSuccessResponse(merchantUser.id, email, merchantUser.fullName, 'merchant');
      }
      
      const merchantUser = await prisma.user.findFirst({ where: { email, role: 'merchant' } });
      if (!merchantUser) {
        return NextResponse.json({ error: 'Invalid merchant credentials' }, { status: 401 });
      }
      
      if (merchantUser.password) {
        const isValid = await bcrypt.compare(password, merchantUser.password);
        if (!isValid) {
          return NextResponse.json({ error: 'Invalid merchant credentials' }, { status: 401 });
        }
      }
      
      return createSuccessResponse(merchantUser.id, merchantUser.email, merchantUser.fullName, 'merchant');
    }
    
    return NextResponse.json({ error: `Unknown role: ${role}` }, { status: 400 });
    
  } catch (error) {
    console.error('❌ Login API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}