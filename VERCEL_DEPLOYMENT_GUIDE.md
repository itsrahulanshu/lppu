# 🚀 Vercel पर Deploy करने का Complete Guide

## ✅ Pre-Requirements

- GitHub Account (free)
- Vercel Account (free) - https://vercel.com
- Anti-Captcha API Key - https://anti-captcha.com (~$5 credit)
- आपके LPU credentials (Username और Password)

---

## 📋 Step-by-Step Deployment Process

### **Step 1: GitHub Repository बनाएं**

1. **GitHub पर जाएं**: https://github.com
2. **New Repository** button पर click करें
3. Repository details भरें:
   - **Repository name**: `lpu-timetable` (या कोई भी नाम)
   - **Description**: `My LPU Timetable App`
   - **Visibility**: **Private** (recommended) या Public
   - ✅ **DO NOT** initialize with README (already exists)
4. **Create repository** button click करें

### **Step 2: Local Code को GitHub पर Push करें**

Terminal में ये commands run करें:

```bash
# आपके local folder में जाएं
cd "/Users/rahulanshu/Downloads/all download/timetable-main"

# GitHub repository को remote के रूप में add करें
# (REPLACE 'your-username' और 'your-repo-name' अपने details से)
git remote add origin https://github.com/your-username/your-repo-name.git

# Code को GitHub पर push करें
git branch -M main
git push -u origin main
```

**उदाहरण:**
```bash
git remote add origin https://github.com/rahulanshu/lpu-timetable.git
git branch -M main
git push -u origin main
```

**अगर password मांगे तो:**
- Username: आपका GitHub username
- Password: Personal Access Token (GitHub Settings → Developer settings → Personal access tokens → Generate new token)

---

### **Step 3: Vercel पर Project Import करें**

1. **Vercel.com पर जाएं**: https://vercel.com
2. **Sign in** या **Sign up** करें (GitHub से login करें - recommended)
3. Dashboard पर **"Add New..."** → **"Project"** पर click करें
4. **Import Git Repository** section में:
   - आपकी GitHub repository दिखेगी
   - Repository के सामने **"Import"** button पर click करें
5. **Configure Project** page पर:
   - **Project Name**: `lpu-timetable` (या कोई नाम)
   - **Framework Preset**: **Other** (या leave as default)
   - **Root Directory**: `./` (default)
   - **Build Command**: leave empty या `npm install`
   - **Output Directory**: leave empty

---

### **Step 4: Environment Variables Add करें**

⚠️ **बहुत Important Step!**

Configure Project page पर नीचे scroll करें **"Environment Variables"** section तक:

**Required Variables (ज़रूरी):**

| Name | Value | कहाँ से लें |
|------|-------|------------|
| `LPU_USERNAME` | आपका registration number | LPU UMS login |
| `LPU_PASSWORD` | आपका LPU password | LPU UMS login |
| `ANTICAPTCHA_API_KEY` | Anti-captcha API key | anti-captcha.com |

**Optional Variables (Optional - पहले से set हैं):**

| Name | Value |
|------|-------|
| `ONESIGNAL_APP_ID` | `6f9f049b-b551-4146-bf55-e5eca15cd724` |
| `ONESIGNAL_API_KEY` | `os_v2_app_n6pqjg5vkfaunp2v4xwkcxgxetklfvomfkoe2fmnhmh4po5fcgx2dwx74zofgosoavn5co6trbjhb77ukknkhhs3ghjgmv4weytquxi` |
| `AUTO_REFRESH_ENABLED` | `true` |
| `AUTO_REFRESH_INTERVAL` | `30` |
| `PWA_VERSION` | `1.9.4` |

**कैसे Add करें:**
1. **Name** field में variable name डालें (जैसे `LPU_USERNAME`)
2. **Value** field में value डालें (जैसे आपका reg number)
3. **Add** button click करें
4. हर variable के लिए repeat करें

---

### **Step 5: Deploy करें!**

1. सभी environment variables add करने के बाद
2. नीचे **"Deploy"** button पर click करें
3. ⏳ Wait करें... (2-3 minutes)
4. 🎉 **Success!** आपका app deploy हो गया!

---

## 🌐 अपने App को Access करें

Deploy होने के बाद आपको मिलेगा:

- **Production URL**: `https://your-app-name.vercel.app`
- **Project Dashboard**: https://vercel.com/dashboard

### Test करें:

1. Browser में URL खोलें: `https://your-app-name.vercel.app`
2. Page load होगा
3. **Refresh button (🔄)** पर click करें
4. 15-20 seconds wait करें (login + captcha solving)
5. ✅ आपका timetable दिख जाएगा!

---

## 🔧 Deployment के बाद

### **अगर कुछ काम नहीं कर रहा:**

1. **Vercel Dashboard** पर जाएं
2. अपने project पर click करें
3. **"Deployments"** tab खोलें
4. Latest deployment पर click करें
5. **"Functions"** या **"Logs"** tab में errors देखें

### **Environment Variables Update करने के लिए:**

1. Vercel Dashboard → आपका Project
2. **"Settings"** tab
3. **"Environment Variables"** section
4. Variables edit करें
5. **"Redeploy"** करें (Deployments tab से)

### **New Changes Deploy करने के लिए:**

```bash
# Local में changes करें
git add .
git commit -m "Your change description"
git push

# Automatic deploy हो जाएगा Vercel पर! 🚀
```

---

## 📱 PWA Install करें (Optional)

Deploy होने के बाद आप app को phone पर install कर सकते हैं:

**Android:**
1. App URL खोलें browser में
2. Menu → "Add to Home Screen"
3. Install करें

**iPhone:**
1. Safari में URL खोलें
2. Share button → "Add to Home Screen"
3. Add करें

---

## 🆘 Common Problems और Solutions

### Problem: "No timetable data. Please refresh first"
**Solution:** Refresh button (🔄) पर click करें

### Problem: "Failed to refresh timetable: Configuration validation failed"
**Solution:** Environment variables check करें - `LPU_USERNAME`, `LPU_PASSWORD`, `ANTICAPTCHA_API_KEY` सही हैं?

### Problem: Deployment failed
**Solution:** 
- Build logs check करें
- `package.json` में सभी dependencies हैं?
- `vercel.json` correct है?

### Problem: Functions timing out
**Solution:**
- Anti-Captcha balance check करें
- Vercel dashboard में function logs देखें

---

## 💰 Cost

- **GitHub**: Free
- **Vercel**: Free (Hobby plan)
  - 100 GB bandwidth/month
  - Unlimited projects
  - Automatic deployments
- **Anti-Captcha**: ~$5 for 1000 captchas
  - 1 refresh = 1 captcha
  - Auto-refresh हर 30 minutes = ~48 captchas/day
  - $5 = ~20 days (if auto-refresh enabled)
  - **Recommendation**: Auto-refresh disable करें, manually refresh करें when needed

---

## 🎯 Next Steps

1. ✅ Deploy करें
2. ✅ Test करें
3. ✅ Mobile पर PWA install करें
4. ✅ Push notifications enable करें
5. 🎉 Enjoy!

---

## 📞 Support

अगर कोई problem आए तो:
1. Vercel logs check करें
2. Browser console check करें (F12)
3. Environment variables verify करें

**Good Luck!** 🚀
