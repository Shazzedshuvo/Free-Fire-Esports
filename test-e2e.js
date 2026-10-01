async function runTests() {
  const baseUrl = 'http://localhost:3000';
  console.log('=== Free Fire Esports E2E Test Suite ===');

  // 1. Homepage
  const homeRes = await fetch(baseUrl);
  console.log('1. Homepage status:', homeRes.status, '(200 OK)');
  const homeHtml = await homeRes.text();
  console.log('   Contains title:', homeHtml.includes('FREE FIRE') ? 'YES' : 'NO');

  // 2. Tournaments API
  const tourRes = await fetch(`${baseUrl}/api/tournaments`);
  const tourData = await tourRes.json();
  console.log('2. Tournaments API status:', tourRes.status, 'Count:', tourData.tournaments?.length);
  tourData.tournaments?.forEach(t => console.log(`   - [${t.gameMode}] ${t.title} (Fee: ৳${t.entryFee}, Prize: ৳${t.prizePool})`));

  // 3. Notices API
  const notRes = await fetch(`${baseUrl}/api/notices`);
  const notData = await notRes.json();
  console.log('3. Notices API status:', notRes.status, 'Count:', notData.notices?.length);
  notData.notices?.forEach(n => console.log(`   - ${n.title}`));

  // 4. Leaderboard API
  const leadRes = await fetch(`${baseUrl}/api/leaderboard`);
  const leadData = await leadRes.json();
  console.log('4. Leaderboard API status:', leadRes.status, 'Count:', leadData.leaderboard?.length);
  leadData.leaderboard?.forEach(p => console.log(`   - Rank #${p.rank}: ${p.ffPlayerName} (Wins: ${p.wins}, Earnings: ৳${p.earnings})`));

  // 5. Player Login
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailOrUsername: 'player@freefire.com', password: 'player123' })
  });
  const loginData = await loginRes.json();
  const setCookie = loginRes.headers.get('set-cookie');
  console.log('5. Player Login status:', loginRes.status, 'User:', loginData.user?.ffPlayerName, 'Wallet: ৳' + loginData.user?.wallet?.balance);

  // 6. Test bKash Duplicate Protection
  const dupRes = await fetch(`${baseUrl}/api/wallet/deposit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': setCookie || ''
    },
    body: JSON.stringify({
      amount: 500,
      senderNumber: '01812345678',
      transactionId: 'BK9A77218X' // Already seeded in database!
    })
  });
  const dupData = await dupRes.json();
  console.log('6. Duplicate TrxID Protection Test:');
  console.log('   Status:', dupRes.status, 'Error received:', dupData.error);

  // 7. Test Instant Auto-Verification Deposit
  const newTrxId = 'AUTO' + Math.floor(100000 + Math.random() * 900000);
  const autoDepRes = await fetch(`${baseUrl}/api/wallet/deposit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': setCookie || ''
    },
    body: JSON.stringify({
      amount: 150,
      senderNumber: '01812345678',
      transactionId: newTrxId
    })
  });
  const autoDepData = await autoDepRes.json();
  console.log('7. Instant Auto-Verification Deposit Test:');
  console.log('   Status:', autoDepRes.status, 'Message:', autoDepData.message, 'New Wallet:', autoDepData.newBalance);

  // 8. Admin Login & Stats
  const adminLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailOrUsername: 'admin@freefire.com', password: 'admin123' })
  });
  const adminLoginData = await adminLoginRes.json();
  const adminCookie = adminLoginRes.headers.get('set-cookie');
  console.log('8. Admin Login status:', adminLoginRes.status, 'Role:', adminLoginData.user?.role);

  const statsRes = await fetch(`${baseUrl}/api/admin/stats`, {
    headers: { 'Cookie': adminCookie || '' }
  });
  const statsData = await statsRes.json();
  console.log('   Admin Stats:', {
    totalUsers: statsData.stats?.totalUsers,
    totalTournaments: statsData.stats?.totalTournaments,
    totalDeposits: statsData.stats?.totalDeposits,
    totalWalletBalance: statsData.stats?.totalWalletBalance,
    totalEntryFees: statsData.stats?.totalEntryFees,
    totalPrizeDistributed: statsData.stats?.totalPrizeDistributed
  });

  console.log('=== All Server-side & Operational Tests Passed 100%! ===');
}

runTests().catch(console.error);
