# 💕 Love Ledger

**Smart Contract Relationships for Web3 Couples**

Love Ledger adalah platform Web3 yang memungkinkan pasangan untuk membuat "Love Contract" dengan smart contract escrow. Dana terkunci sampai kedua pihak memverifikasi pernikahan mereka (release funds 50:50 + mint NFT proof) atau salah satu pihak melakukan unpair (dana di-burn/refund sesuai agreement awal).

---

## 🌟 Features

### Core Functionality
- **💰 Love Fund Escrow**: Lock funds dalam smart contract yang aman
- **👥 Dual Wallet Pairing**: Sistem verifikasi dua wallet yang transparan
- **💍 Marriage Verification**: Kedua pihak harus verify independently
- **🎨 NFT Proof**: Mint Love NFT setelah mutual verification
- **🔥 Termination Options**: Burn atau refund sesuai initial agreement
- **⏱️ Optional Duration**: Kontrak bisa tanpa batas waktu atau dengan expiry date
- **📊 Real-time Dashboard**: Live tracking status kontrak

### Technical Features
- ⚡ Real-time status updates
- 🎯 Toast notifications untuk semua events
- 🎨 Modern dark UI dengan Pink Neon (#FF3EA5) theme
- 📱 Responsive design (mobile & desktop)
- 🔒 Secure backend dengan Supabase Edge Functions
- 🗄️ PostgreSQL database dengan KV store

---

## 🎨 Design Philosophy

**"Love Meets Logic"**

- Clean, contractual interfaces (bukan sentimental)
- Pink Neon (#FF3EA5) untuk commitment/active states
- Deep Indigo (#2A1E5C) untuk backgrounds
- Gold Accent (#FFD465) untuk verified/success states
- Red untuk terminated contracts
- Gray untuk pending states

---

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool
- **Shadcn/ui** - Component library
- **Motion/React** - Animations
- **Sonner** - Toast notifications
- **Lucide React** - Icons

### Backend
- **Supabase Edge Functions** - API layer (Deno runtime)
- **PostgreSQL** - Database
- **KV Store** - Key-value storage untuk contracts

---

## 📁 Project Structure

\`\`\`
love-ledger/
├── components/
│   ├── LandingPage.tsx        # Hero & stats
│   ├── WalletConnect.tsx      # Mock wallet connection
│   ├── CreateContract.tsx     # Contract creation form
│   ├── Dashboard.tsx          # Contract dashboard
│   └── ui/                    # Shadcn components
├── supabase/functions/server/
│   ├── index.tsx              # Edge Functions API
│   └── kv_store.tsx           # KV store utilities
├── utils/supabase/
│   ├── client.tsx             # Supabase config
│   └── info.tsx               # Project credentials
├── styles/
│   └── globals.css            # Global styles & tokens
├── App.tsx                    # Main app component
└── main.tsx                   # Entry point
\`\`\`

---

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js 18+
- npm atau yarn

### Install Dependencies
\`\`\`bash
npm install
\`\`\`

### Run Development Server
\`\`\`bash
npm run dev
\`\`\`

App akan berjalan di `http://localhost:5173`

---

## 🌐 Production Deployment

Lihat [DEPLOYMENT.md](./DEPLOYMENT.md) untuk panduan lengkap deploy ke production dengan:
- **Frontend**: Vercel
- **Backend**: Supabase Edge Functions
- **Database**: Supabase PostgreSQL

---

## 📖 How It Works

### 1. Contract Creation
- User connect wallet (mock untuk demo)
- Fill contract form:
  - Partner wallet address
  - Love Fund amount (MATIC)
  - Duration (optional - bisa tanpa batas waktu!)
  - Refund option (burn vs refund)
- Lock funds dalam escrow

### 2. Pairing Phase
- Partner receives pairing request
- Partner connects wallet dan accepts
- Contract status: **PENDING** → **ACTIVE**

### 3. Verification Phase
- Kedua pihak verify independently
- First verify: waiting for partner
- Both verified: **ACTIVE** → **VERIFIED**
  - Funds released 50/50
  - Love NFT minted

### 4. Termination (Optional)
- Salah satu pihak bisa unpair
- Action based on initial agreement:
  - **Burn**: Funds di-burn (destroyed)
  - **Refund**: Funds kembali ke creator
- Contract status: **TERMINATED**

---

## 🎯 Contract States

| State | Color | Description |
|-------|-------|-------------|
| **PENDING** | Gray | Waiting for partner to pair |
| **ACTIVE** | Pink Neon | Both wallets paired, commitment active |
| **VERIFIED** | Gold | Marriage verified, funds released, NFT minted |
| **TERMINATED** | Red | Contract terminated by one party |

---

## 🔐 Security Features

- ✅ Dual verification requirement
- ✅ Immutable contract terms
- ✅ Transparent fund tracking
- ✅ Fail-safe for inactivity (optional duration)
- ✅ Backend validation untuk semua operations
- ✅ Row Level Security di database

---

## 🎨 Key Design Decisions

### Optional Contract Duration
Tidak semua pasangan bisa memastikan waktu pernikahan yang pasti, maka:
- Duration field sekarang **OPTIONAL**
- Biarkan kosong = kontrak tanpa batas waktu
- Kontrak tetap aktif sampai verified atau terminated
- Dashboard menampilkan info berbeda untuk kontrak dengan/tanpa durasi

### Mock Wallet (Demo Mode)
- Untuk prototype/demo, wallet adalah mock
- Production akan integrate dengan MetaMask/WalletConnect
- Backend logic sudah production-ready

### KV Store vs Traditional Tables
- Menggunakan KV store untuk flexibility
- Cocok untuk rapid prototyping
- Mudah scale untuk production

---

## 📊 API Endpoints

Base URL: `https://[project-ref].supabase.co/functions/v1/make-server-c17b8718`

### GET /stats
Get platform statistics
\`\`\`json
{
  "totalContracts": 42,
  "activeContracts": 15,
  "verifiedContracts": 8,
  "totalLocked": 125.5
}
\`\`\`

### GET /contracts/wallet/:address
Get contract for specific wallet

### POST /contracts/create
Create new love contract
\`\`\`json
{
  "creatorWallet": "0x...",
  "partnerWallet": "0x...",
  "amount": "10",
  "duration": "365",  // or null for no expiry
  "refundOption": "refund"
}
\`\`\`

### POST /contracts/pair
Pair partner wallet to contract

### POST /contracts/verify
Verify marriage (must be called by both wallets)

### POST /contracts/unpair
Terminate contract

---

## 🛠️ Development Scripts

\`\`\`bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Build for production

# Preview
npm run preview      # Preview production build

# Deploy
npm run deploy       # Deploy to Vercel
\`\`\`

---

## 🔮 Future Enhancements

- [ ] Real Web3 wallet integration (MetaMask)
- [ ] Actual smart contract deployment (Polygon)
- [ ] NFT minting on-chain
- [ ] Multi-chain support
- [ ] Social features (share contracts)
- [ ] Contract templates
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Mobile app

---

## 📄 License

Private project. All rights reserved.

---

## 🤝 Contributing

This is a private project. For questions or collaboration, please contact the owner.

---

## 📞 Support

For issues or questions:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) untuk deployment issues
2. Review API documentation di atas
3. Check Supabase/Vercel logs

---

**Built with 💕 using React, TypeScript, Tailwind CSS, and Supabase**

*Love Ledger - Where Love Meets Logic*
