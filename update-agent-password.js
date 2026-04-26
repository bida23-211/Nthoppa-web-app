const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateAgentPassword() {
  try {
    const email = 'john.doe@example.com';
    const newPassword = 'password123';
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const agent = await prisma.agent.update({
      where: { email: email },
      data: { loginPassword: hashedPassword }
    });
    
    console.log('✅ Agent password updated successfully!');
    console.log('Email:', agent.email);
    console.log('Name:', agent.name);
    console.log('New password:', newPassword);
    console.log('Hashed password:', hashedPassword);
    
  } catch (error) {
    console.error('❌ Error updating agent password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAgentPassword();