# 📖 Free Fire Esports Platform — Complete API & System Documentation

Official API specifications, architecture overview, authentication standards, and developer guide for the **Free Fire Esports Platform**.

---

## 📑 Table of Contents
1. [Platform Overview & Tech Stack](#1-platform-overview--tech-stack)
2. [Authentication & Authorization](#2-authentication--authorization)
3. [Super Admin Credentials](#3-super-admin-credentials)
4. [Complete API Endpoints Specification](#4-complete-api-endpoints-specification)
   - [Auth APIs](#a-authentication-apis)
   - [Tournament & Match APIs](#b-tournament--match-apis)
   - [Wallet, Deposit & Cashout APIs](#c-wallet-deposit--cashout-apis)
   - [Live Support & Auto-Reply APIs](#d-live-support--auto-reply-apis)
   - [Notices & Public Settings APIs](#e-notices--public-settings-apis)
   - [Super Admin Control APIs](#f-super-admin-control-apis)
5. [Database Schema (Prisma Models)](#5-database-schema-prisma-models)
6. [Tournament Eligibility & Custom Room Rules](#6-tournament-eligibility--custom-room-rules)
7. [Setup & Deployment Commands](#7-setup--deployment-commands)

---

## 1. Platform Overview & Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Frontend**: React 18, TailwindCSS, Lucide Icons, Glassmorphic / Day & Night Design
- **Database & ORM**: SQLite (`prisma/dev.db`) managed via **Prisma ORM**
- **Authentication**: JWT stored in secure `httpOnly` cookies, bcryptjs password hashing
- **Real-Time Live Support**: Dedicated session isolation per player with automatic keyword-based auto-replies
- **Language**: Bilingual (বাংলা & English) with persistent state

---

## 2. Authentication & Authorization

All private and admin requests use a secure JSON Web Token (JWT) issued on login and stored in an `httpOnly` cookie named `auth_token`.

### Role Hierarchy
| Role | Access Level | Description |
| :--- | :--- | :--- |
| `SUPER_ADMIN` | **Full Platform Access** | Dedicated console at `/admin`, full balance adjustments, user suspension, financial tracking |
| `ADMIN` | **Operations** | Match creation, deposit approval, result declaration |
| `USER` | **Player** | Match participation, wallet deposit/withdrawal, live chat, profile settings |

---

## 3. Super Admin Credentials

- **Email**: `admni@123.gmail.com` *(or `admin@123.gmail.com` / username `admin`)*
- **Password**: `Admin@123`
- **Role**: `SUPER_ADMIN`
- **Admin Console URL**: `http://localhost:3000/admin`

> [!NOTE]  
> Public users cannot view or access the `/admin` console. Unauthenticated or non-admin attempts are automatically redirected to `/login` or `/dashboard`.

---

## 4. Complete API Endpoints Specification

### A. Authentication APIs

#### 1. Register New Player
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "fullName": "Shuvo Ahmed",
  "username": "shuvo_pro",
  "email": "shuvo@gmail.com",
  "ffPlayerName": "SHUVO_FF",
  "ffUid": "1984729103",
  "mobileNumber": "01719052334",
  "password": "Password123"
}
```
- **Response** `(201 Created)`:
```json
{
  "success": true,
  "user": { "id": "uuid", "username": "shuvo_pro", "role": "USER" }
}
```

#### 2. User & Admin Login
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "identifier": "admni@123.gmail.com",
  "password": "Admin@123"
}
```
- **Response** `(200 OK)`: Sets `auth_token` cookie and returns user profile + redirect route.

#### 3. Current Session User (Me)
- **Endpoint**: `GET /api/auth/me`
- **Access**: Authenticated
- **Response** `(200 OK)`: Returns full user data, wallet balance, and registered role.

#### 4. Update Profile
- **Endpoint**: `PUT /api/auth/me`
- **Access**: Authenticated
- **Request Body**: `{ "fullName": "...", "ffPlayerName": "...", "mobileNumber": "..." }`

#### 5. Logout
- **Endpoint**: `POST /api/auth/logout`
- **Access**: Authenticated
- **Response** `(200 OK)`: Clears authentication cookie.

---

### B. Tournament & Match APIs

#### 6. List / Filter Tournaments
- **Endpoint**: `GET /api/tournaments`
- **Access**: Public
- **Query Params**:
  - `mode`: `ALL` | `SOLO` | `DUO` | `SQUAD`
  - `status`: `ALL` | `REGISTRATION_OPEN` | `LIVE` | `COMPLETED`
  - `filter`: `free` | `paid` | `my` (for user's registered matches)

#### 7. Create New Tournament
- **Endpoint**: `POST /api/tournaments`
- **Access**: Admin / Super Admin
- **Request Body**:
```json
{
  "title": "Weekly Clash Squad Championship",
  "gameMode": "SQUAD",
  "mapName": "Bermuda",
  "entryFee": 100,
  "prizePool": 2000,
  "winnerPrize": 1200,
  "runnerUpPrize": 800,
  "totalSlots": 12,
  "matchDate": "2026-10-02",
  "matchTime": "08:30 PM",
  "bannerImage": "/images/image2.png"
}
```

#### 8. Match Details & Room Credentials
- **Endpoint**: `GET /api/tournaments/[id]`
- **Access**: Public (Room ID/Password are masked unless user is registered or admin)
- **Endpoint**: `PUT /api/tournaments/[id]` *(Admin: Update Room ID/Password & Status)*
- **Endpoint**: `DELETE /api/tournaments/[id]` *(Admin: Delete Tournament)*

#### 9. Join Tournament (Atomic Registration)
- **Endpoint**: `POST /api/tournaments/[id]/join`
- **Access**: Authenticated Player
- **Preconditions**:
  - Wallet balance >= `entryFee`
  - User agreed to eligibility rules (Level 50+, Rank Heroic/Diamond IV, correct UID)
- **Request Body**:
```json
{
  "teamName": "Apex BD",
  "player1Name": "Shuvo",
  "player1Uid": "1984729103",
  "player2Name": "Rakib",
  "player2Uid": "2837491029",
  "player3Name": "Tanvir",
  "player3Uid": "3928471920",
  "player4Name": "Sakib",
  "player4Uid": "4928371921"
}
```

#### 10. Match Results & Prize Distribution
- **Endpoint**: `POST /api/tournaments/[id]/results`
- **Access**: Admin / Super Admin
- **Action**: Declares winner/runner-up and **automatically credits prize money** directly to the winning player's wallet with transaction receipts.

---

### C. Wallet, Deposit & Cashout APIs

#### 11. Submit Deposit Request
- **Endpoint**: `POST /api/wallet/deposit`
- **Access**: Authenticated Player
- **Request Body**:
```json
{
  "amount": 500,
  "paymentMethod": "bKash",
  "senderNumber": "01712345678",
  "transactionId": "BL9X2910KP"
}
```
- **Validation**: Enforces strict unique check on `transactionId` to prevent duplicate submissions.

#### 12. Player's Deposit History
- **Endpoint**: `GET /api/wallet/my-deposits`
- **Access**: Authenticated Player

#### 13. Submit Withdrawal / Cashout Request
- **Endpoint**: `POST /api/wallet/withdraw`
- **Access**: Authenticated Player
- **Request Body**:
```json
{
  "amount": 300,
  "paymentMethod": "bKash",
  "accountNumber": "01712345678"
}
```
- **Validation**: Minimum withdrawal ৳50. Deducts balance and notifies admin.

#### 14. Transaction Audit History
- **Endpoint**: `GET /api/wallet/transactions?type=ALL|DEPOSIT|TOURNAMENT_ENTRY|PRIZE`
- **Access**: Authenticated Player

---

### D. Live Support & Auto-Reply APIs

#### 15. Player Live Chat & Auto Assistant
- **Endpoint**: `GET /api/chat?sessionId={sessionId}`
  - Returns conversation history for the specific user session.
- **Endpoint**: `POST /api/chat`
  - Sends user message, generates **instant automated replies** for common queries, and saves both to history.
- **Request Body**:
```json
{
  "sessionId": "user_uuid_here",
  "text": "রুম আইডি ও পাসওয়ার্ড কখন পাবো?",
  "senderName": "Shuvo Ahmed",
  "ffUid": "1984729103",
  "phoneNumber": "01719052334"
}
```
- **Automated Keywords Handled**:
  - `রুম আইডি / Room ID & Password`: Explains 10-minute disclosure rule.
  - `ডিপোজিট নম্বর / Deposit Number`: Provides official number `01719052334` & Send Money guide.
  - `টাকা অ্যাড হতে কত সময় / Delay`: Explains 5-15 min admin verification time.
  - `খেলার নিয়ম / Level & Rank Rules`: Details Level 50+ & Heroic/Diamond IV rule.
  - `উইথড্র / Withdraw Rules`: Explains ৳50 minimum cashout procedure.

#### 16. Admin Live Chat Helpdesk
- **Endpoint**: `GET /api/admin/chat` (Lists all player threads sorted by latest activity)
- **Endpoint**: `GET /api/admin/chat?sessionId={sessionId}` (Fetches thread messages)
- **Endpoint**: `POST /api/admin/chat` (Sends admin reply to player)

---

### E. Notices & Public Settings APIs

#### 17. Notices & Announcements
- **Endpoint**: `GET /api/notices` (Returns active announcements, pinned first)
- **Endpoint**: `POST /api/notices` (Admin: Publishes new notice)

#### 18. Leaderboard Rankings
- **Endpoint**: `GET /api/leaderboard` (Returns top players ranked by prize earnings and wins)

#### 19. Public Site Settings
- **Endpoint**: `GET /api/settings` (Returns official bKash number, WhatsApp link, YouTube Live stream link)

---

### F. Super Admin Control APIs

#### 20. Deposit Review & Approval
- **Endpoint**: `GET /api/admin/deposits` (Filter by `PENDING`, `APPROVED`, `REJECTED`)
- **Endpoint**: `PUT /api/admin/deposits`
- **Request Body**:
```json
{
  "depositId": "deposit_uuid",
  "action": "APPROVE" // or "REJECT" with "reason"
}
```
- **Action**: Approving instantly credits player's wallet and updates financial reports.

#### 21. Platform Financials & Profit/Loss Report
- **Endpoint**: `GET /api/admin/financials`
- **Response**: Calculates Net Revenue, Total Deposits, Match Entry Fees, and Total Prizes Paid.

#### 22. User Management & Manual Balance Adjustments
- **Endpoint**: `GET /api/admin/users?search={query}`
- **Endpoint**: `PUT /api/admin/users`
- **Request Body**:
```json
{
  "userId": "user_uuid",
  "action": "CREDIT", // "DEBIT", "SUSPEND", "UNSUSPEND"
  "amount": 200,
  "reason": "Prize adjustment for bonus kill"
}
```

---

## 5. Database Schema (Prisma Models)

The SQLite database (`prisma/dev.db`) contains the following primary models:

```prisma
model User {
  id            String         @id @default(uuid())
  fullName      String
  username      String         @unique
  email         String         @unique
  passwordHash  String
  ffPlayerName  String
  ffUid         String         @unique
  mobileNumber  String
  role          UserRole       @default(USER)
  status        AccountStatus  @default(ACTIVE)
  wallet        Wallet?
  participations TournamentParticipant[]
}

model Wallet {
  id              String         @id @default(uuid())
  userId          String         @unique
  balance         Float          @default(0.0)
  totalDeposited  Float          @default(0.0)
  totalWon        Float          @default(0.0)
  totalEntryFees  Float          @default(0.0)
  transactions    Transaction[]
  deposits        DepositRequest[]
}

model Tournament {
  id              String         @id @default(uuid())
  title           String
  gameMode        GameMode
  mapName         String
  entryFee        Float
  prizePool       Float
  totalSlots      Int
  remainingSlots  Int
  matchDate       String
  matchTime       String
  roomId          String?
  roomPassword    String?
  status          TournamentStatus @default(REGISTRATION_OPEN)
  participants    TournamentParticipant[]
}

model DepositRequest {
  id              String         @id @default(uuid())
  walletId        String
  amount          Float
  paymentMethod   String
  senderNumber    String
  transactionId   String         @unique
  status          DepositStatus  @default(PENDING)
}
```

---

## 6. Tournament Eligibility & Custom Room Rules

Every player participating in tournaments must adhere to these strict conditions:

1. **Exact Free Fire UID Verification**: Players MUST join custom rooms using the exact Free Fire UID submitted during registration. Joining with any alternate account results in immediate disqualification without entry fee refund.
2. **Account Level 50+**: Game account level must be minimum **50+**.
3. **Battle Royale (BR) Rank**: Rank must be **Heroic** for Full Map / Battle Royale matches.
4. **Clash Squad (CS) Rank**: Rank must be minimum **Diamond IV** for Clash Squad tournaments.
5. **Room Credentials Delivery**: Room ID and Password are disclosed on the player's match page exactly **10 minutes before match time**.

---

## 7. Setup & Deployment Commands

```bash
# 1. Install dependencies
npm install

# 2. Synchronize database schema
npx prisma generate
npx prisma db push

# 3. Seed initial tournament and demo data
node prisma/seed.js

# 4. Verify Super Admin account
node prisma/set-superadmin.js

# 5. Build production bundle & start server
npm run build
npm run start
```
