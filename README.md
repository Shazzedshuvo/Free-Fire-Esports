# Free Fire Esports Tournament Web Application (Bangladesh)

A complete, modern, responsive esports tournament web platform inspired by Free Fire. Players can create accounts, deposit BDT into their wallet via bKash, join paid Solo, Duo, and Squad tournaments, view upcoming matches, receive notices, view custom room credentials, and cash out prizes.

Includes a comprehensive, role-protected **Admin Dashboard** for tournament creation, user management, manual wallet adjustments with mandatory audit logs, bKash deposit verification, results declaration, and system settings.

---

## 🎮 Key Features

### 1. Design & Esports Aesthetic
- **Gaming Dark Theme**: Free Fire-inspired charcoal background (`#0a0b0e`), fiery orange (`#FF5A00`), amber (`#FF9900`), and gold accents.
- **Micro-Animations**: Hexagonal styling, glowing buttons, and glassmorphism cards.
- **Mobile-First Experience**: Fixed bottom navigation bar (`Home`, `Matches`, `Wallet`, `Notices`, `Profile`) designed for mobile gamers.

### 2. Bilingual Support (বাংলা & English)
- Instant switcher in the header with persistent state across all pages.
- Full localization for buttons, forms, rules, wallet actions, and notices.

### 3. Real Authentication & Security
- Sign Up with Free Fire In-Game Name, numeric Free Fire UID, Mobile Number, Email, and Password.
- Duplicate prevention: unique email, username, and Free Fire UID checks.
- Password hashing with `bcryptjs` and session tokens stored in secure `httpOnly` cookies.
- Role-Based Access Control (`SUPER_ADMIN`, `ADMIN`, `FINANCE_MANAGER`, `TOURNAMENT_MANAGER`, `MODERATOR`, `USER`).

### 4. Secure Wallet & bKash Deposit System
- Every player has a server-managed internal wallet (`dev.db` via Prisma SQLite).
- **bKash Deposit Flow**:
  1. Displays official bKash personal/merchant payment number with 1-click copy.
  2. Player inputs amount (৳50 – ৳25,000), sender mobile number, and bKash Transaction ID (TrxID).
  3. **Duplicate Transaction Protection**: A TrxID can only ever be used once. Attempting duplicate submissions immediately rejects with *"This transaction ID has already been used"*.
  4. **Verification Architecture**:
     - Automated verification simulation: TrxIDs prefixed with `AUTO` or `INSTANT` are immediately verified and credited to the wallet.
     - Fallback review: Standard submissions enter `PENDING REVIEW` status, allowing Admin to verify the merchant statement and click **Approve** or **Reject** with audit logging.

### 5. Atomic Tournament Join Process
- **Atomic Database Transaction**:
  1. Checks available slots and tournament status.
  2. Verifies wallet balance against entry fee.
  3. Deducts entry fee from wallet.
  4. Creates `TOURNAMENT_ENTRY` transaction record.
  5. Registers player (and team members with UIDs for Duo/Squad).
  6. Decrements remaining slots atomically with automatic rollback if any step fails.
- Duo & Squad forms dynamically capture Player 1–4 names and UIDs.

### 6. Protected Custom Room ID & Password
- Credentials remain strictly hidden until the admin publishes them or release time arrives.
- Only registered players in that specific tournament have access to reveal credentials.

### 7. Results Declaration & Automatic Prize Payout
- Admin enters match standings (Winner, Runner-up, 3rd, kills, placement points).
- 1-click **Confirm Results** automatically credits the winner's wallet and issues an official `PRIZE` wallet transaction.

### 8. Full Admin Dashboard
- **Overview**: Real-time financial statistics (total deposits, player wallet liabilities, entry fees collected, prize payouts) and liquidity charts.
- **Tournaments**: Create, update status, publish Room ID/password, delete tournaments.
- **bKash Deposits**: Filter by Pending/Approved/Rejected, 1-click Approve/Reject with reason modal and search.
- **User Control**: Search players by UID/phone, toggle account suspension, and adjust balances with mandatory reasons and audit trail.
- **Notices**: Create pinned announcements, updates, maintenance notices.
- **Settings**: Update official bKash number, WhatsApp link, Telegram channel, and deposit limits.
- **Audit Logs**: Comprehensive activity log tracking every admin action with timestamps.

---

## 🔑 Demo Accounts

### Regular Players
- **Player 1**: `player@freefire.com` / `player123` (IGN: `★FIRE_KNIGHT★`, UID: `782394110`, Balance: ৳650+)
- **Player 2**: `pro_gamer@freefire.com` / `player123` (IGN: `APEX_NOVA_BD`, UID: `819203841`, Balance: ৳420)
- **Player 3**: `rakib@freefire.com` / `player123` (IGN: `SHADOW_VIPER`, UID: `938210492`, Balance: ৳200)

### Administration
- **Super Admin**: `admin@freefire.com` / `admin123` (Full platform control & role assignment)
- **Tournament Manager**: `tournaments@freefire.com` / `admin123` (Match host & room publisher)
- **Finance Manager**: `finance@freefire.com` / `admin123` (Deposit reviews & financial monitoring)

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Synchronize and seed database
npx prisma generate
npx prisma db push
node prisma/seed.js

# 3. Start production server
npm run build
npm run start
# App is live on http://localhost:3000
```
