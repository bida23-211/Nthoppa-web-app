const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash passwords for all roles
  const agentPassword = await bcrypt.hash('agent123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);
  const clientPassword = await bcrypt.hash('client123', 10);
  const hrPassword = await bcrypt.hash('hr123', 10);
  const merchantPassword = await bcrypt.hash('merchant123', 10);
  const defaultPassword = await bcrypt.hash('password123', 10);
  
  // Create agents
  const agentData = [
    {
      name: 'John Motsumi',
      email: 'john.motsumi@nthoppa.com',
      loginEmail: 'agent@nthoppa.com',
      loginPassword: agentPassword,
      territory: 'Gaborone Central',
      isActive: true,
      nthoppaCoins: 1250,
      streakDays: 5,
    },
    {
      name: 'Sarah Kgosi',
      email: 'sarah.kgosi@nthoppa.com',
      loginEmail: 'sarah@nthoppa.com',
      loginPassword: defaultPassword,
      territory: 'Francistown',
      isActive: true,
      nthoppaCoins: 850,
      streakDays: 3,
    },
    {
      name: 'Mary Phiri',
      email: 'mary.phiri@nthoppa.com',
      loginEmail: 'mary@nthoppa.com',
      loginPassword: defaultPassword,
      territory: 'Serowe',
      isActive: true,
      nthoppaCoins: 2100,
      streakDays: 12,
    },
  ];

  const createdAgents = [];
  for (const data of agentData) {
    try {
      const agent = await prisma.agent.upsert({
        where: { loginEmail: data.loginEmail },
        update: data,
        create: data,
      });
      createdAgents.push(agent);
      console.log(`✅ Created agent: ${agent.name} (${agent.loginEmail})`);
    } catch (error) {
      console.error(`❌ Failed to create agent ${data.loginEmail}:`, error.message);
    }
  }

  const [john, sarah, mary] = createdAgents;

  // Create admin user (in User table)
  try {
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@nthoppa.com' },
      update: {},
      create: {
        fullName: 'System Administrator',
        email: 'admin@nthoppa.com',
        password: adminPassword,
        phone: '+267 71 000 001',
        status: 'active',
        role: 'admin',
        completionRate: 100,
        nthoppaCoins: 0,
        registrationDate: new Date(),
      },
    });
    console.log(`✅ Created admin user: ${adminUser.email}`);
  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message);
  }

  // Create client user
  try {
    const clientUser = await prisma.user.upsert({
      where: { email: 'client@nthoppa.com' },
      update: {},
      create: {
        fullName: 'Josephine Morolong',
        email: 'client@nthoppa.com',
        password: clientPassword,
        phone: '+267 71 234 569',
        status: 'active',
        role: 'client',
        completionRate: 78,
        nthoppaCoins: 150,
        registrationDate: new Date(),
      },
    });
    console.log(`✅ Created client user: ${clientUser.email}`);
  } catch (error) {
    console.error('❌ Failed to create client user:', error.message);
  }

  // Create HR user
  try {
    const hrUser = await prisma.user.upsert({
      where: { email: 'hr@nthoppa.com' },
      update: {},
      create: {
        fullName: 'Thabo Molefe',
        email: 'hr@nthoppa.com',
        password: hrPassword,
        phone: '+267 71 234 570',
        status: 'active',
        role: 'hr',
        completionRate: 90,
        nthoppaCoins: 0,
        registrationDate: new Date(),
      },
    });
    console.log(`✅ Created HR user: ${hrUser.email}`);
  } catch (error) {
    console.error('❌ Failed to create HR user:', error.message);
  }

  // Create merchant user
  try {
    const merchantUser = await prisma.user.upsert({
      where: { email: 'merchant@nthoppa.com' },
      update: {},
      create: {
        fullName: 'Kgabo General Store',
        email: 'merchant@nthoppa.com',
        password: merchantPassword,
        phone: '+267 71 234 571',
        status: 'active',
        role: 'merchant',
        completionRate: 95,
        nthoppaCoins: 500,
        registrationDate: new Date(),
      },
    });
    console.log(`✅ Created merchant user: ${merchantUser.email}`);
  } catch (error) {
    console.error('❌ Failed to create merchant user:', error.message);
  }

  // Create regular users (clients) only if we have agents
  if (john && sarah && mary) {
    const userData = [
      { fullName: 'Kabelo Motsumi', email: 'kabelo@example.com', phone: '+26771234567', status: 'active', agentId: john.id, completionRate: 100, nthoppaCoins: 150, role: 'client' },
      { fullName: 'Tshepo Kgosi', email: 'tshepo@example.com', phone: '+26771345678', status: 'pending', agentId: john.id, completionRate: 45, nthoppaCoins: 50, role: 'client' },
      { fullName: 'Mpho Sebina', email: 'mpho@example.com', phone: '+26771456789', status: 'active', agentId: john.id, completionRate: 100, nthoppaCoins: 200, role: 'client' },
      { fullName: 'Boitumelo Phiri', email: 'boitumelo@example.com', phone: '+26771567890', status: 'pending', agentId: sarah.id, completionRate: 30, nthoppaCoins: 25, role: 'client' },
      { fullName: 'Thato Mmolawa', email: 'thato@example.com', phone: '+26771678901', status: 'active', agentId: sarah.id, completionRate: 100, nthoppaCoins: 175, role: 'client' },
      { fullName: 'Lerato Kgosiemang', email: 'lerato@example.com', phone: '+26771789012', status: 'inactive', agentId: mary.id, completionRate: 0, nthoppaCoins: 0, role: 'client' },
    ];

    for (const data of userData) {
      try {
        const user = await prisma.user.upsert({
          where: { email: data.email },
          update: {},
          create: {
            fullName: data.fullName,
            email: data.email,
            password: defaultPassword,
            phone: data.phone,
            status: data.status,
            agentId: data.agentId,
            role: data.role,
            completionRate: data.completionRate,
            nthoppaCoins: data.nthoppaCoins,
            registrationDate: new Date(),
          },
        });
        console.log(`✅ Created user: ${user.fullName}`);
        
        // Create financial profile for each user
        await prisma.financialProfile.upsert({
          where: { userId: user.id },
          update: {},
          create: {
            userId: user.id,
            monthlyIncome: data.fullName === 'Kabelo Motsumi' ? 5000 : 3000,
            employmentStatus: 'employed',
            literacyScore: Math.floor(Math.random() * 100),
          },
        });
      } catch (error) {
        console.error(`❌ Failed to create user ${data.email}:`, error.message);
      }
    }
  }

  // Create courses
  console.log('\n📚 Seeding courses...');
  
  const courseData = [
    {
      title: 'Budgeting Basics',
      description: 'Learn how to track income, manage expenses, and create a budget that works for you.',
      content: JSON.stringify({
        lessons: [
          { title: 'Understanding Your Income', content: 'Learn to calculate your total monthly income.', duration: '5 min' },
          { title: 'Tracking Expenses', content: 'Discover where your money goes.', duration: '10 min' },
          { title: 'Creating a Budget', content: 'Build a realistic budget.', duration: '15 min' }
        ]
      }),
      coinsReward: 50,
      requiredScore: 0,
      order: 1
    },
    {
      title: 'Saving Strategies',
      description: 'Master the art of saving with proven strategies.',
      content: JSON.stringify({
        lessons: [
          { title: 'Emergency Fund Basics', content: 'Save 3-6 months of expenses.', duration: '8 min' },
          { title: 'Goal-Based Saving', content: 'Set and achieve savings goals.', duration: '12 min' },
          { title: 'Automated Saving Systems', content: 'Build wealth automatically.', duration: '10 min' }
        ]
      }),
      coinsReward: 75,
      requiredScore: 40,
      order: 2
    },
    {
      title: 'Investment Fundamentals',
      description: 'Introduction to stocks, bonds, and diversification.',
      content: JSON.stringify({
        lessons: [
          { title: 'Stocks Explained', content: 'Understanding the stock market.', duration: '15 min' },
          { title: 'Bonds & Fixed Income', content: 'Safe investments.', duration: '12 min' },
          { title: 'Building a Diversified Portfolio', content: 'Spread risk across assets.', duration: '20 min' }
        ]
      }),
      coinsReward: 100,
      requiredScore: 70,
      order: 3
    }
  ];

  for (const data of courseData) {
    try {
      const course = await prisma.course.upsert({
        where: { title: data.title },
        update: data,
        create: data,
      });
      console.log(`✅ Created course: ${course.title} (${course.coinsReward} coins)`);
    } catch (error) {
      console.error(`❌ Failed to create course ${data.title}:`, error.message);
    }
  }

  // Create motshelo groups
  if (john && sarah && mary) {
    console.log('\n👥 Creating motshelo groups...');
    
    const groupData = [
      {
        name: "Women's Empowerment Group",
        description: "A savings group focused on empowering women entrepreneurs in Gaborone",
        agentId: john.id,
        monthlyContribution: 200,
        currentBalance: 2400,
        totalMembers: 12,
        status: "active"
      },
      {
        name: "Youth Savings Circle",
        description: "Young professionals saving for future investments",
        agentId: sarah.id,
        monthlyContribution: 100,
        currentBalance: 800,
        totalMembers: 8,
        status: "active"
      },
      {
        name: "Business Growth Group",
        description: "Small business owners pooling resources for expansion",
        agentId: mary.id,
        monthlyContribution: 500,
        currentBalance: 5000,
        totalMembers: 10,
        status: "active"
      }
    ];

    for (const data of groupData) {
      try {
        const group = await prisma.motsheloGroup.create({
          data: data,
        });
        console.log(`✅ Created motshelo group: ${group.name}`);
      } catch (error) {
        console.error(`❌ Failed to create motshelo group ${data.name}:`, error.message);
      }
    }
  }

  // Create agent record for admin (for backward compatibility)
  try {
    await prisma.agent.upsert({
      where: { loginEmail: 'admin@nthoppa.com' },
      update: {},
      create: {
        name: 'System Administrator',
        email: 'admin@nthoppa.com',
        loginEmail: 'admin@nthoppa.com',
        loginPassword: adminPassword,
        territory: 'Head Office',
        isActive: true,
        nthoppaCoins: 0,
        streakDays: 0,
      },
    });
    console.log('✅ Created admin agent record');
  } catch (error) {
    console.error('❌ Failed to create admin agent record:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🔐 LOGIN CREDENTIALS:');
  console.log('='.repeat(60));
  console.log('\n📋 ADMIN PORTAL:');
  console.log(`   Email: admin@nthoppa.com`);
  console.log(`   Password: admin123`);
  
  console.log('\n📋 AGENT PORTAL:');
  console.log(`   Email: agent@nthoppa.com | Password: agent123`);
  console.log(`   Email: sarah@nthoppa.com | Password: password123`);
  console.log(`   Email: mary@nthoppa.com | Password: password123`);
  
  console.log('\n📋 CLIENT PORTAL:');
  console.log(`   Email: client@nthoppa.com | Password: client123`);
  
  console.log('\n📋 HR PORTAL:');
  console.log(`   Email: hr@nthoppa.com | Password: hr123`);
  
  console.log('\n📋 MERCHANT PORTAL:');
  console.log(`   Email: merchant@nthoppa.com | Password: merchant123`);
  
  console.log('='.repeat(60));
  console.log('\n========== SEED COMPLETE ==========');
  console.log('====================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });