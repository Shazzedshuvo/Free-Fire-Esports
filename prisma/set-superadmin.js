const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = 'Admin@123';
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log('Setting up Super Admin credentials...');

  // Target emails / usernames to configure
  const adminEmail = 'admni@123.gmail.com';
  const aliasEmail = 'admin@123.gmail.com';

  // Check if superadmin exists
  const existingSuper = await prisma.user.findFirst({
    where: {
      OR: [
        { role: 'SUPER_ADMIN' },
        { email: adminEmail },
        { email: aliasEmail },
        { username: 'superadmin' },
        { username: 'admin' },
      ],
    },
    include: { wallet: true },
  });

  if (existingSuper) {
    console.log(`Updating existing admin: ${existingSuper.email} (${existingSuper.username})`);
    await prisma.user.update({
      where: { id: existingSuper.id },
      data: {
        email: adminEmail,
        username: 'admin',
        passwordHash: hashedPassword,
        role: 'SUPER_ADMIN',
        fullName: 'Super Administrator',
        ffPlayerName: 'SUPER_ADMIN',
        isSuspended: false,
      },
    });
    console.log('Updated admin successfully!');
  } else {
    console.log('Creating new Super Admin...');
    await prisma.user.create({
      data: {
        fullName: 'Super Administrator',
        username: 'admin',
        ffPlayerName: 'SUPER_ADMIN',
        ffUid: '100000001',
        mobileNumber: '01700000000',
        email: adminEmail,
        passwordHash: hashedPassword,
        role: 'SUPER_ADMIN',
        wallet: {
          create: {
            balance: 100000,
            totalDeposited: 100000,
            totalWon: 0,
            totalEntryFees: 0,
          },
        },
      },
    });
    console.log('Created new Super Admin successfully!');
  }

  // Also make sure if user types admin@123.gmail.com, we can have a fallback or handle in login API
  console.log('Admin ready:');
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
