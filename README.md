# 🎓 LPU Timetable - Personal Schedule App

A Progressive Web App (PWA) that automatically fetches and displays your LPU timetable with push notifications for schedule changes.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO)

## ✨ Features

- 🔄 **Auto-Refresh**: Automatically fetches your latest timetable every 30 minutes
- 🔔 **Push Notifications**: Get notified when your schedule changes
- 📱 **PWA Support**: Install as a native app on mobile and desktop
- 🌙 **Dark Mode**: Easy on the eyes with built-in dark mode
- 📊 **Clean UI**: Modern, responsive design that works on all devices
- 🔒 **Secure**: Your credentials are stored as encrypted environment variables
- ⚡ **Fast**: Optimized caching for instant loading

## 🚀 Quick Deploy to Vercel

### Prerequisites

1. **LPU Account** - Your registration number and password
2. **Anti-Captcha API Key** - Get from [anti-captcha.com](https://anti-captcha.com) (~$5 credit)
3. **GitHub Account** - Free at [github.com](https://github.com)
4. **Vercel Account** - Free at [vercel.com](https://vercel.com)

### Deployment Steps

1. **Fork/Clone this repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/lpu-timetable.git
   cd lpu-timetable
   ```

2. **Push to your GitHub**
   ```bash
   git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

3. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables (see below)
   - Click "Deploy"

4. **Set Environment Variables** in Vercel Dashboard
   ```
   LPU_USERNAME=your_registration_number
   LPU_PASSWORD=your_password
   ANTICAPTCHA_API_KEY=your_api_key
   ```

5. **Done!** 🎉 Your app is live at `https://your-app.vercel.app`

## 📖 Detailed Documentation

For a complete step-by-step guide with screenshots and troubleshooting, open `how_to_deploy.html` in your browser.

## 🔧 Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `LPU_USERNAME` | Your LPU registration number | `12345678` |
| `LPU_PASSWORD` | Your LPU UMS password | `YourPassword@123` |
| `ANTICAPTCHA_API_KEY` | API key from anti-captcha.com | `a1b2c3d4e5f6...` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `ONESIGNAL_APP_ID` | OneSignal app ID for notifications | Pre-configured |
| `ONESIGNAL_API_KEY` | OneSignal API key | Pre-configured |
| `APP_URL` | Your Vercel deployment URL | `http://localhost:3000` |
| `AUTO_REFRESH_ENABLED` | Enable auto-refresh | `true` |
| `AUTO_REFRESH_INTERVAL` | Refresh interval (minutes) | `30` |
| `PWA_VERSION` | App version for cache busting | `1.9.4` |

## 💻 Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create .env file**
   ```bash
   cp .env.example .env
   # Edit .env and add your credentials
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   ```
   http://localhost:3000
   ```

## 📱 Using the App

### Install as PWA

**On Mobile (Android/iOS):**
1. Open the app in Chrome/Safari
2. Tap menu (⋮) → "Add to Home Screen"
3. App installs like a native app

**On Desktop (Chrome/Edge):**
1. Look for install icon (➕) in address bar
2. Click "Install"
3. App opens in its own window

### Enable Notifications

1. Allow notifications when prompted
2. Receive updates when timetable changes
3. Works even when app is closed

## 🏗️ Project Structure

```
lpu-timetable/
├── src/
│   ├── server.js           # Main Express server
│   ├── login.js            # LPU authentication
│   ├── modules/
│   │   ├── auth.js         # Session management
│   │   ├── timetable.js    # Timetable fetching
│   │   ├── notifications.js # Push notifications
│   │   └── cache.js        # Data caching
│   └── data/               # Cache storage
├── public/
│   ├── index.html          # Main app interface
│   ├── manifest.json       # PWA manifest
│   ├── sw.js              # Service worker
│   └── assets/            # CSS, JS, icons
├── vercel.json            # Vercel configuration
├── .env.example           # Environment template
└── how_to_deploy.html     # Deployment guide
```

## 🔍 Troubleshooting

### Deployment Failed
- Verify all required environment variables are set
- Check Vercel deployment logs
- Ensure no typos in variable names

### Timetable Not Loading
- Verify LPU credentials are correct
- Check Anti-Captcha API key and balance
- Check browser console for errors (F12)

### Notifications Not Working
- Allow notifications in browser settings
- Set ONESIGNAL_APP_ID and ONESIGNAL_API_KEY
- Update APP_URL to your Vercel URL

## 💡 Pro Tips

- ✅ Install as PWA for best experience
- ✅ Enable notifications for schedule updates
- ✅ Use dark mode to save battery
- ✅ Keep Anti-Captcha account topped up
- ✅ Check balance monthly

## 🔒 Security

- ✅ Environment variables are encrypted on Vercel
- ✅ `.env` file is git-ignored
- ✅ No credentials stored in code
- ✅ Session cookies are temporary
- ✅ HTTPS encryption on Vercel

## 💰 Cost Breakdown

| Service | Cost | Notes |
|---------|------|-------|
| Vercel | FREE | Hobby plan for personal projects |
| GitHub | FREE | Public repositories |
| Anti-Captcha | ~$5 | Lasts several months |
| OneSignal | FREE | Up to 10,000 notifications/month |

**Total:** ~$5 one-time (lasts months)

## 📝 License

MIT License - Feel free to use and modify!

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## ⚠️ Disclaimer

This is an unofficial app not affiliated with LPU. Use at your own risk.

---

Made with ❤️ for LPU Students | Deployed on Vercel ⚡
