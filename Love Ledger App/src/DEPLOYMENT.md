# 🚀 Love Ledger - Production Deployment Guide

Complete guide untuk deploy Love Ledger ke production menggunakan **Vercel (Frontend)** dan **Supabase (Backend)**.

---

## 📋 Prerequisites

Sebelum memulai, pastikan Anda memiliki:

- [ ] Akun [Supabase](https://supabase.com) (free tier tersedia)
- [ ] Akun [Vercel](https://vercel.com) (free tier tersedia)
- [ ] [Git](https://git-scm.com/) installed
- [ ] [Node.js](https://nodejs.org/) v18+ installed
- [ ] [Supabase CLI](https://supabase.com/docs/guides/cli) installed

---

## 🗄️ Part 1: Setup Supabase Backend

### Step 1: Buat Supabase Project

1. Login ke [supabase.com](https://supabase.com)
2. Klik **"New Project"**
3. Isi detail project:
   - **Name**: `love-ledger` (atau nama lain)
   - **Database Password**: Buat password yang kuat (simpan!)
   - **Region**: Pilih yang terdekat dengan target users (e.g., `Southeast Asia`)
4. Tunggu ~2 menit sampai project setup selesai

### Step 2: Setup Database Table

1. Di Supabase Dashboard, buka **SQL Editor**
2. Klik **"New Query"**
3. Copy-paste SQL berikut:

\`\`\`sql
-- Create KV Store table for Love Ledger
CREATE TABLE IF NOT EXISTS kv_store_c17b8718 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_kv_store_value ON kv_store_c17b8718 USING GIN (value);

-- Enable RLS (Row Level Security)
ALTER TABLE kv_store_c17b8718 ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role full access
CREATE POLICY "Service role has full access"
  ON kv_store_c17b8718
  FOR ALL
  USING (auth.role() = 'service_role');
\`\`\`

4. Klik **"Run"** untuk execute
5. Verify table sudah dibuat di **Table Editor**

### Step 3: Deploy Edge Functions

1. **Install Supabase CLI** (jika belum):
   \`\`\`bash
   npm install -g supabase
   \`\`\`

2. **Login to Supabase**:
   \`\`\`bash
   supabase login
   \`\`\`

3. **Link project ke local**:
   \`\`\`bash
   supabase link --project-ref YOUR_PROJECT_REF
   \`\`\`
   
   *Note: Project ref bisa dilihat di URL dashboard (e.g., `https://app.supabase.com/project/YOUR_PROJECT_REF`)*

4. **Deploy Edge Function**:
   \`\`\`bash
   supabase functions deploy make-server-c17b8718 --no-verify-jwt
   \`\`\`

5. **Verify deployment**:
   - Buka **Edge Functions** di Supabase Dashboard
   - Cek status `make-server-c17b8718` harus **Active**

### Step 4: Get API Keys

1. Di Supabase Dashboard, buka **Project Settings** → **API**
2. Copy dan simpan values berikut:
   - **Project URL**: `https://[YOUR_PROJECT_REF].supabase.co`
   - **anon/public key**: `eyJhbG...` (key panjang)
   - **service_role key**: `eyJhbG...` (key panjang, RAHASIA!)

⚠️ **PENTING**: `service_role` key JANGAN pernah di-commit ke Git atau diexpose ke frontend!

---

## 🌐 Part 2: Setup Vercel Frontend

### Step 1: Push Code ke GitHub

1. **Buat GitHub repository baru**:
   - Login ke [github.com](https://github.com)
   - Klik **"New repository"**
   - Name: `love-ledger`
   - Set ke **Private** (recommended)
   - **JANGAN** centang "Initialize with README"

2. **Push local code ke GitHub**:
   \`\`\`bash
   # Initialize git (jika belum)
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit - Love Ledger production ready"
   
   # Add remote
   git remote add origin https://github.com/YOUR_USERNAME/love-ledger.git
   
   # Push
   git branch -M main
   git push -u origin main
   \`\`\`

### Step 2: Deploy ke Vercel

1. **Login ke [vercel.com](https://vercel.com)**
2. Klik **"Add New Project"**
3. **Import Git Repository**:
   - Pilih repository `love-ledger`
   - Klik **"Import"**

4. **Configure Project**:
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

5. **Add Environment Variables**:
   Klik **"Environment Variables"** dan tambahkan:
   
   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | `https://[YOUR_PROJECT_REF].supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbG...` (anon key dari Supabase) |

6. Klik **"Deploy"**

7. **Tunggu deployment selesai** (~2-3 menit)

8. Vercel akan memberikan URL production:
   - `https://love-ledger-xxxxx.vercel.app`

---

## ✅ Part 3: Testing & Verification

### Test Backend (Edge Functions)

\`\`\`bash
# Test stats endpoint
curl https://[YOUR_PROJECT_REF].supabase.co/functions/v1/make-server-c17b8718/stats \\
  -H "Authorization: Bearer [YOUR_ANON_KEY]"

# Expected response:
{
  "totalContracts": 0,
  "activeContracts": 0,
  "verifiedContracts": 0,
  "totalLocked": 0
}
\`\`\`

### Test Frontend

1. Buka URL Vercel di browser
2. Test flow:
   - ✅ Connect Wallet (gunakan address dummy untuk test)
   - ✅ Create Contract
   - ✅ View Dashboard
   - ✅ Pair dengan wallet lain
   - ✅ Verify marriage
   - ✅ Check toast notifications muncul

### Common Issues & Solutions

#### ❌ "Failed to fetch" error

**Cause**: CORS atau environment variables salah

**Solution**:
1. Verify env variables di Vercel dashboard
2. Redeploy: `vercel --prod`
3. Check browser console untuk error details

#### ❌ "Unauthorized" error

**Cause**: API key salah atau expired

**Solution**:
1. Regenerate API keys di Supabase
2. Update env variables di Vercel
3. Redeploy

#### ❌ "Table not found" error

**Cause**: Database table belum dibuat

**Solution**:
1. Re-run SQL script dari Step 2 di Supabase
2. Verify table exists di Table Editor

---

## 🔧 Part 4: Custom Domain (Optional)

### Setup Custom Domain di Vercel

1. Beli domain (e.g., dari Namecheap, GoDaddy)
2. Di Vercel dashboard, buka **Project Settings** → **Domains**
3. Klik **"Add"** dan masukkan domain (e.g., `loveledger.com`)
4. Follow instruksi untuk update DNS records
5. Tunggu propagation (~24 jam, biasanya lebih cepat)

---

## 📊 Monitoring & Maintenance

### Supabase Monitoring

- **Database Usage**: Settings → Usage
- **Edge Function Logs**: Edge Functions → Logs
- **Request Analytics**: Reports

### Vercel Monitoring

- **Deployment Status**: Deployments tab
- **Analytics**: Analytics tab (jika enabled)
- **Function Logs**: Functions tab

### Update Deployment

Setiap kali push ke GitHub main branch, Vercel otomatis deploy:

\`\`\`bash
git add .
git commit -m "Update: [describe changes]"
git push origin main
# Vercel auto-deploys! 🚀
\`\`\`

---

## 💰 Pricing (Free Tier Limits)

### Supabase Free Tier
- ✅ 500 MB database
- ✅ 2M Edge Function invocations/month
- ✅ 1 GB file storage
- ✅ 50 MB bandwidth/month

### Vercel Free Tier
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains

**Untuk prototype/demo, free tier sudah sangat cukup!**

---

## 🛡️ Security Best Practices

1. ✅ **NEVER** commit `.env` files
2. ✅ Use environment variables untuk API keys
3. ✅ Regenerate `service_role` key secara berkala
4. ✅ Enable RLS (Row Level Security) di Supabase
5. ✅ Monitor logs untuk suspicious activity
6. ✅ Set rate limiting di Edge Functions (untuk production)

---

## 🆘 Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Edge Functions Guide**: https://supabase.com/docs/guides/functions
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html

---

## 🎉 Success!

Selamat! Love Ledger Anda sudah live di production dengan:

✅ Frontend di Vercel  
✅ Backend di Supabase  
✅ Database PostgreSQL  
✅ Edge Functions untuk API  
✅ Auto HTTPS & CDN  

**Production URL**: `https://[your-project].vercel.app`

Share link ke partner Anda dan mulai test Love Contract! 💕

---

**Need help?** Check troubleshooting section atau contact support.
