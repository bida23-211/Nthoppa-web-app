const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // Create agents
  const agentData = [
    {
      name: 'John Motsumi',
      email: 'john.motsumi@nthoppa.com',
      loginEmail: 'john.doe@example.com',
      loginPassword: hashedPassword,
      territory: 'Gaborone Central',
      isActive: true,
      nthoppaCoins: 1250,
      streakDays: 5,
    },
    {
      name: 'Sarah Kgosi',
      email: 'sarah.kgosi@nthoppa.com',
      loginEmail: 'sarah@nthoppa.com',
      loginPassword: hashedPassword,
      territory: 'Francistown',
      isActive: true,
      nthoppaCoins: 850,
      streakDays: 3,
    },
    {
      name: 'Mary Phiri',
      email: 'mary.phiri@nthoppa.com',
      loginEmail: 'mary@nthoppa.com',
      loginPassword: hashedPassword,
      territory: 'Serowe',
      isActive: true,
      nthoppaCoins: 2100,
      streakDays: 12,
    },
  ];

  const createdAgents = [];
  for (const data of agentData) {
    const agent = await prisma.agent.upsert({
      where: { loginEmail: data.loginEmail },
      update: {},
      create: data,
    });
    createdAgents.push(agent);
    console.log(`✅ Created agent: ${agent.name} (${agent.loginEmail})`);
  }

  const [john, sarah, mary] = createdAgents;

  // Create users (clients)
  const userData = [
    { fullName: 'Kabelo Motsumi', email: 'kabelo@example.com', phone: '+26771234567', status: 'active', agentId: john.id, completionRate: 100, nthoppaCoins: 150 },
    { fullName: 'Tshepo Kgosi', email: 'tshepo@example.com', phone: '+26771345678', status: 'pending', agentId: john.id, completionRate: 45, nthoppaCoins: 50 },
    { fullName: 'Mpho Sebina', email: 'mpho@example.com', phone: '+26771456789', status: 'active', agentId: john.id, completionRate: 100, nthoppaCoins: 200 },
    { fullName: 'Boitumelo Phiri', email: 'boitumelo@example.com', phone: '+26771567890', status: 'pending', agentId: sarah.id, completionRate: 30, nthoppaCoins: 25 },
    { fullName: 'Thato Mmolawa', email: 'thato@example.com', phone: '+26771678901', status: 'active', agentId: sarah.id, completionRate: 100, nthoppaCoins: 175 },
    { fullName: 'Lerato Kgosiemang', email: 'lerato@example.com', phone: '+26771789012', status: 'inactive', agentId: mary.id, completionRate: 0, nthoppaCoins: 0 },
  ];

  const createdUsers = [];
  for (const data of userData) {
    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: {},
      create: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        status: data.status,
        agentId: data.agentId,
        completionRate: data.completionRate,
        nthoppaCoins: data.nthoppaCoins,
        registrationDate: new Date(),
      },
    });
    createdUsers.push(user);
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
    const course = await prisma.course.upsert({
      where: { title: data.title },
      update: {},
      create: data,
    });
    console.log(`✅ Created course: ${course.title} (${course.coinsReward} coins)`);
  }

  // Create motshelo groups
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
    const group = await prisma.motsheloGroup.create({
      data: data,
    });
    console.log(`✅ Created motshelo group: ${group.name}`);
  }

  // Create admin user (no role field - it doesn't exist in schema)
  const adminPassword = 'admin123';
  const adminHash = await bcrypt.hash(adminPassword, 10);
  
  // Write the hash back to .env automatically
  const envPath = path.join(__dirname, '../.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  envContent = envContent.replace(
    /ADMIN_PASSWORD_HASH=".*"/,
    `ADMIN_PASSWORD_HASH="${adminHash}"`
  );
  fs.writeFileSync(envPath, envContent);
  console.log('✅ ADMIN_PASSWORD_HASH written to .env automatically');
  
  await prisma.agent.upsert({
    where: { loginEmail: 'admin@nthoppa.com' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@nthoppa.com',
      loginEmail: 'admin@nthoppa.com',
      loginPassword: adminHash,
      territory: 'Head Office',
      isActive: true,
      nthoppaCoins: 0,
      streakDays: 0,
    },
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('🔐 LOGIN CREDENTIALS:');
  console.log('='.repeat(60));
  console.log('\n📋 ADMIN PORTAL:');
  console.log(`   Email: admin@nthoppa.com`);
  console.log(`   Password: admin123`);
  
  console.log('\n📋 AGENT PORTAL:');
  console.log(`   Email: john.doe@example.com | Password: password123`);
  console.log(`   Email: sarah@nthoppa.com | Password: password123`);
  console.log(`   Email: mary@nthoppa.com | Password: password123`);
  
  console.log('\n📋 CLIENT PORTAL:');
  console.log(`   After logging in as an Agent or Admin, use the floating button`);
  console.log(`   (bottom-right corner) to switch to the Client portal.`);
  console.log(`   Client accounts: kabelo@example.com, mpho@example.com, thato@example.com`);
  console.log('='.repeat(60));
  console.log('\n========== SEED COMPLETE ==========');
  console.log('Admin login:  admin@nthoppa.com  /  admin123');
  console.log('Agent login:  john.doe@example.com  /  password123');
  console.log('Agent login:  sarah@nthoppa.com  /  password123');
  console.log('Agent login:  mary@nthoppa.com  /  password123');
  console.log('====================================\n');
  
  console.log('\n✅ Seeding complete!');
  console.log(`\n📊 Summary:`);
  console.log(`   - ${createdAgents.length} agents created`);
  console.log(`   - ${createdUsers.length} clients created`);
  console.log(`   - ${courseData.length} courses created`);
  console.log(`   - ${groupData.length} motshelo groups created`);
  console.log(`   - 1 admin account created`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });