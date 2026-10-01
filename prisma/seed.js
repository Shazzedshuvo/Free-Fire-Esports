const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.auditLog.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.heroSlide.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.tournamentResult.deleteMany();
  await prisma.tournamentParticipant.deleteMany();
  await prisma.tournament.deleteMany();
  await prisma.depositRequest.deleteMany();
  await prisma.walletTransaction.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.user.deleteMany();
  await prisma.systemSetting.deleteMany();

  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const hashedUserPassword = await bcrypt.hash('player123', 10);

  console.log('Seeding system settings...');
  const settings = [
    { key: 'site_name', value: 'FREE FIRE ESPORTS BD' },
    { key: 'bkash_number', value: '01892837461' },
    { key: 'bkash_type', value: 'Personal (Send Money)' },
    { key: 'min_deposit', value: '50' },
    { key: 'max_deposit', value: '25000' },
    { key: 'whatsapp_link', value: 'https://wa.me/8801892837461' },
    { key: 'telegram_link', value: 'https://t.me/ff_esports_bd' },
    { key: 'support_email', value: 'support@ff-esports.bd' },
    { key: 'announcement_bar', value: '🔥 bKash Instant Deposit Active 24/7! Join upcoming Solo & Squad custom matches now!' },
  ];

  for (const s of settings) {
    await prisma.systemSetting.create({ data: s });
  }

  console.log('Seeding admin users...');
  const superAdmin = await prisma.user.create({
    data: {
      fullName: 'Super Administrator',
      username: 'superadmin',
      ffPlayerName: 'ADMIN_CHIEF',
      ffUid: '100000001',
      mobileNumber: '01711000001',
      email: 'admin@freefire.com',
      passwordHash: hashedAdminPassword,
      role: 'SUPER_ADMIN',
      wallet: {
        create: {
          balance: 10000,
          totalDeposited: 10000,
          totalWon: 0,
          totalEntryFees: 0,
        },
      },
    },
  });

  const tourneyAdmin = await prisma.user.create({
    data: {
      fullName: 'Tournament Coordinator',
      username: 'tourneyboss',
      ffPlayerName: 'HOST_MASTER',
      ffUid: '100000002',
      mobileNumber: '01711000002',
      email: 'tournaments@freefire.com',
      passwordHash: hashedAdminPassword,
      role: 'TOURNAMENT_MANAGER',
      wallet: {
        create: {
          balance: 2000,
          totalDeposited: 2000,
          totalWon: 0,
          totalEntryFees: 0,
        },
      },
    },
  });

  const financeAdmin = await prisma.user.create({
    data: {
      fullName: 'Finance Officer',
      username: 'financehead',
      ffPlayerName: 'FINANCE_OP',
      ffUid: '100000003',
      mobileNumber: '01711000003',
      email: 'finance@freefire.com',
      passwordHash: hashedAdminPassword,
      role: 'FINANCE_MANAGER',
      wallet: {
        create: {
          balance: 5000,
          totalDeposited: 5000,
          totalWon: 0,
          totalEntryFees: 0,
        },
      },
    },
  });

  console.log('Seeding regular players...');
  const player1 = await prisma.user.create({
    data: {
      fullName: 'Shuvo Ahmed',
      username: 'FireKnight99',
      ffPlayerName: '★FIRE_KNIGHT★',
      ffUid: '782394110',
      mobileNumber: '01812345678',
      email: 'player@freefire.com',
      passwordHash: hashedUserPassword,
      role: 'USER',
      wallet: {
        create: {
          balance: 650,
          totalDeposited: 800,
          totalWon: 1500,
          totalEntryFees: 150,
        },
      },
    },
    include: { wallet: true },
  });

  const player2 = await prisma.user.create({
    data: {
      fullName: 'Tariqul Islam',
      username: 'ApexPredator',
      ffPlayerName: 'APEX_NOVA_BD',
      ffUid: '819203841',
      mobileNumber: '01987654321',
      email: 'pro_gamer@freefire.com',
      passwordHash: hashedUserPassword,
      role: 'USER',
      wallet: {
        create: {
          balance: 420,
          totalDeposited: 500,
          totalWon: 800,
          totalEntryFees: 100,
        },
      },
    },
    include: { wallet: true },
  });

  const player3 = await prisma.user.create({
    data: {
      fullName: 'Rakib Hassan',
      username: 'ShadowRider',
      ffPlayerName: 'SHADOW_VIPER',
      ffUid: '938210492',
      mobileNumber: '01655443322',
      email: 'rakib@freefire.com',
      passwordHash: hashedUserPassword,
      role: 'USER',
      wallet: {
        create: {
          balance: 200,
          totalDeposited: 300,
          totalWon: 0,
          totalEntryFees: 100,
        },
      },
    },
    include: { wallet: true },
  });

  console.log('Seeding sample transactions & deposit requests...');
  // Sample transactions for player1
  await prisma.walletTransaction.create({
    data: {
      walletId: player1.wallet.id,
      type: 'DEPOSIT',
      amount: 500,
      balanceAfter: 500,
      paymentMethod: 'bKash',
      senderNumber: '01812345678',
      externalTxnId: 'BK9A77218X',
      status: 'APPROVED',
      notes: 'bKash Deposit verified',
      createdAt: new Date(Date.now() - 3600000 * 48),
    },
  });

  await prisma.walletTransaction.create({
    data: {
      walletId: player1.wallet.id,
      type: 'TOURNAMENT_ENTRY',
      amount: -50,
      balanceAfter: 450,
      paymentMethod: 'Internal Wallet',
      status: 'APPROVED',
      notes: 'Joined Solo Bermuda Battle #102',
      createdAt: new Date(Date.now() - 3600000 * 24),
    },
  });

  await prisma.walletTransaction.create({
    data: {
      walletId: player1.wallet.id,
      type: 'PRIZE',
      amount: 250,
      balanceAfter: 700,
      paymentMethod: 'Internal Wallet',
      status: 'APPROVED',
      notes: 'Tournament Prize: Solo Bermuda Champion',
      createdAt: new Date(Date.now() - 3600000 * 12),
    },
  });

  // Pending deposit request for admin verification demo
  await prisma.depositRequest.create({
    data: {
      userId: player2.id,
      amount: 300,
      method: 'bKash',
      senderNumber: '01987654321',
      transactionId: 'BK8Y99120Z',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 1800000),
    },
  });

  // Approved deposit request
  await prisma.depositRequest.create({
    data: {
      userId: player1.id,
      amount: 500,
      method: 'bKash',
      senderNumber: '01812345678',
      transactionId: 'BK9A77218X',
      status: 'APPROVED',
      verifiedBy: 'Auto-Verified / System',
      verifiedAt: new Date(Date.now() - 3600000 * 48),
      createdAt: new Date(Date.now() - 3600000 * 48),
    },
  });

  console.log('Seeding tournaments...');
  const t1 = await prisma.tournament.create({
    data: {
      title: 'Solo Bermuda Clash #104 - High Stakes',
      bannerImage: '/images/image.png',
      description: 'Solo custom battle in classic Bermuda map. Surviving the zone and racking up kills is the key to glory. Top 3 players win verified bKash cash prizes.',
      gameMode: 'SOLO',
      mapName: 'Bermuda',
      entryFee: 50,
      prizePool: 2000,
      winnerPrize: 1200,
      runnerUpPrize: 500,
      thirdPlacePrize: 300,
      perKillPrize: 10,
      totalSlots: 48,
      remainingSlots: 32,
      matchDate: 'Tonight',
      matchTime: '08:30 PM',
      registrationDeadline: new Date(Date.now() + 3600000 * 3),
      roomId: '918237',
      roomPassword: 'FF99',
      isRoomCredentialsPublished: true,
      rules: '1. No teaming allowed under any circumstances. Teaming results in instant ban and zero prize.\n2. Emulator players strictly prohibited. Mobile only lobby.\n3. Room ID and Password will appear 15 minutes before the match.\n4. Take screenshot of your rank and kill count for verification.',
      status: 'REGISTRATION_OPEN',
    },
  });

  // Register player1 in t1
  await prisma.tournamentParticipant.create({
    data: {
      tournamentId: t1.id,
      userId: player1.id,
      slotNumber: 1,
      player1Name: player1.ffPlayerName,
      player1Uid: player1.ffUid,
    },
  });

  const t2 = await prisma.tournament.create({
    data: {
      title: 'Squad Kalahari Championship Cup #28',
      bannerImage: '/images/image2.png',
      description: 'Full 4-player Squad tactical warfare on Kalahari! Bring your clan, execute precise rotations, and claim the championship prize pool.',
      gameMode: 'SQUAD',
      mapName: 'Kalahari',
      entryFee: 200,
      prizePool: 8000,
      winnerPrize: 5000,
      runnerUpPrize: 2000,
      thirdPlacePrize: 1000,
      perKillPrize: 25,
      totalSlots: 12,
      remainingSlots: 5,
      matchDate: 'Tomorrow',
      matchTime: '09:00 PM',
      registrationDeadline: new Date(Date.now() + 3600000 * 24),
      roomId: '772190',
      roomPassword: 'SQUAD2026',
      isRoomCredentialsPublished: false,
      rules: '1. All 4 members must be registered with exact Free Fire UIDs.\n2. One optional substitute allowed.\n3. Squad leader must join the custom room on time.\n4. Hacker/glitch exploiters will have team disqualified immediately.',
      status: 'REGISTRATION_OPEN',
    },
  });

  const t3 = await prisma.tournament.create({
    data: {
      title: 'Duo Purgatory Blitz - Fast & Furious',
      bannerImage: '/images/image3.png',
      description: 'Pair up with your trusted wingman in Purgatory. Heavy action, quick skirmishes, and instant rewards.',
      gameMode: 'DUO',
      mapName: 'Purgatory',
      entryFee: 100,
      prizePool: 4000,
      winnerPrize: 2500,
      runnerUpPrize: 1000,
      thirdPlacePrize: 500,
      perKillPrize: 15,
      totalSlots: 24,
      remainingSlots: 0,
      matchDate: 'Live Now',
      matchTime: '07:00 PM',
      registrationDeadline: new Date(Date.now() - 1800000),
      roomId: '551920',
      roomPassword: 'DUOBATTLE',
      isRoomCredentialsPublished: true,
      rules: '1. Mobile only, no PC emulators.\n2. Teaming is bannable.\n3. Both teammates must survive or play actively.',
      status: 'LIVE',
    },
  });

  const t4 = await prisma.tournament.create({
    data: {
      title: 'NexTerra Super Cup Series - Completed',
      bannerImage: '/images/image4.png',
      description: 'Futuristic combat on NexTerra with intense anti-gravity fights and top-tier esports gameplay.',
      gameMode: 'SOLO',
      mapName: 'NexTerra',
      entryFee: 50,
      prizePool: 2000,
      winnerPrize: 1200,
      runnerUpPrize: 500,
      thirdPlacePrize: 300,
      perKillPrize: 10,
      totalSlots: 48,
      remainingSlots: 0,
      matchDate: 'Yesterday',
      matchTime: '08:00 PM',
      registrationDeadline: new Date(Date.now() - 3600000 * 24),
      roomId: '334182',
      roomPassword: 'DONE',
      isRoomCredentialsPublished: true,
      rules: 'Completed tournament.',
      status: 'COMPLETED',
      winnerTeam: 'FireKnight99 (★FIRE_KNIGHT★)',
    },
  });

  // Seed tournament results for t4
  await prisma.tournamentResult.createMany({
    data: [
      {
        tournamentId: t4.id,
        rank: 1,
        playerNameOrTeam: 'FireKnight99 (★FIRE_KNIGHT★)',
        kills: 11,
        placementPoints: 20,
        totalPoints: 31,
        prizeEarned: 1200,
        isPrizeDistributed: true,
        userId: player1.id,
      },
      {
        tournamentId: t4.id,
        rank: 2,
        playerNameOrTeam: 'ApexPredator (APEX_NOVA_BD)',
        kills: 7,
        placementPoints: 15,
        totalPoints: 22,
        prizeEarned: 500,
        isPrizeDistributed: true,
        userId: player2.id,
      },
      {
        tournamentId: t4.id,
        rank: 3,
        playerNameOrTeam: 'ShadowRider (SHADOW_VIPER)',
        kills: 4,
        placementPoints: 10,
        totalPoints: 14,
        prizeEarned: 300,
        isPrizeDistributed: true,
        userId: player3.id,
      },
    ],
  });

  console.log('Seeding Hero Slides...');
  await prisma.heroSlide.createMany({
    data: [
      {
        title: 'DOMINATE THE BATTLEFIELD, WIN REAL BDT CASH',
        subtitle: 'Bangladesh #1 Free Fire esports platform. Play Solo, Duo & Squad tournaments with verified bKash cash prizes.',
        buttonText: 'Browse Tournaments',
        buttonLink: '/matches',
        bgImage: '/images/image.png',
        displayOrder: 1,
        isActive: true,
      },
      {
        title: 'SQUAD WAR NIGHT - ৳10,000 PRIZE POOL',
        subtitle: 'Assemble your 4-player team and conquer the Kalahari battleground tonight at 9:00 PM!',
        buttonText: 'Join Squad Match',
        buttonLink: `/matches/${t2.id}`,
        bgImage: '/images/image2.png',
        displayOrder: 2,
        isActive: true,
      },
      {
        title: 'INSTANT BKASH DEPOSIT & AUTO VERIFICATION',
        subtitle: 'Zero delay wallet deposits 24 hours a day with official bKash verification and instant slot booking.',
        buttonText: 'Deposit Now',
        buttonLink: '/deposit',
        bgImage: '/images/image3.png',
        displayOrder: 3,
        isActive: true,
      },
      {
        title: 'PRO LEAGUE ELITE SHOWDOWN',
        subtitle: 'Battle against top Free Fire players across Bangladesh with 100% anti-cheat protected lobbies.',
        buttonText: 'View Leaderboard',
        buttonLink: '/leaderboard',
        bgImage: '/images/image4.png',
        displayOrder: 4,
        isActive: true,
      },
    ],
  });

  console.log('Seeding official notices...');
  await prisma.notice.createMany({
    data: [
      {
        title: '🔥 bKash Instant Deposit Active 24/7!',
        description: 'Players can now deposit funds anytime. Simply send money to our official bKash number, enter your TrxID, and balance is verified promptly.',
        type: 'IMPORTANT',
        isPinned: true,
        isActive: true,
      },
      {
        title: '🏆 NexTerra Super Cup Champions Announced!',
        description: 'Congratulations to ★FIRE_KNIGHT★ for taking 1st Place with 11 eliminations and claiming the ৳1,200 cash prize! Prizes have been credited to player wallets.',
        type: 'WINNER_ANNOUNCEMENT',
        isPinned: false,
        isActive: true,
      },
      {
        title: '🛡️ Strict Anti-Cheat & Fair Play Enforcement',
        description: 'Third party config files, mod menus, emulators or teaming in Solo matches will lead to an immediate permanent ban and forfeiture of all balances.',
        type: 'IMPORTANT',
        isPinned: false,
        isActive: true,
      },
      {
        title: '⚔️ Weekly Squad Showdown Registration Open',
        description: 'Squad slots are filling fast. Register your full squad with UID numbers before 8:30 PM tonight to secure your room entrance.',
        type: 'TOURNAMENT',
        isPinned: false,
        isActive: true,
      },
    ],
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
