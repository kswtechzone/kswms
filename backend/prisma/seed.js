const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash('Admin@123', 10);

  // 1. Create Demo Organization
  const org = await prisma.organization.upsert({
    where: { slug: 'ksw-hq' },
    update: {},
    create: {
      name: 'KSWMS Headquarters',
      slug: 'ksw-hq',
      enabledModules: ['DASHBOARD', 'HOTEL_MANAGEMENT'],
    },
  });

  // 2. Create Super Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kswtechzone.com' },
    update: {},
    create: {
      email: 'admin@kswtechzone.com',
      passwordHash,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      organizationId: org.id,
    },
  });

  console.log('--- Seeding Completed ---');
  console.log('Super Admin: admin@kswtechzone.com / Admin@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
