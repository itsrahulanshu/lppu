# 🚀 Quick Start Guide - LPU Timetable Deployment

## One-Minute Setup

### Step 1: Get Anti-Captcha API Key
1. Visit [anti-captcha.com](https://anti-captcha.com)
2. Sign up and add $5 credit
3. Copy your API key from Settings → API Setup

### Step 2: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Import your repository
4. Add these environment variables:
   - `LPU_USERNAME` → Your registration number
   - `LPU_PASSWORD` → Your LPU password
   - `ANTICAPTCHA_API_KEY` → Your API key from step 1
5. Click **Deploy**

### Step 4: Done! 🎉
- Your app is live at `https://your-app.vercel.app`
- Install it as a PWA on your phone
- Enable notifications

## Required Environment Variables

```env
LPU_USERNAME=12345678
LPU_PASSWORD=YourPassword@123
ANTICAPTCHA_API_KEY=your_api_key_here
```

## Optional (Recommended)

```env
AUTO_REFRESH_ENABLED=true
AUTO_REFRESH_INTERVAL=30
PWA_VERSION=1.9.4
```

## Need More Help?

Open `how_to_deploy.html` for detailed instructions with screenshots.

---

**Total Time:** ~5 minutes  
**Total Cost:** ~$5 (Anti-Captcha credit, lasts months)  
**Difficulty:** Easy 😊
