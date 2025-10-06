# 📚 LPU Timetable - Serverless Express PWA# 🎓 LPU Timetable



> A modern, serverless Progressive Web App for LPU students to view their timetable with automatic change detection and notifications.A serverless Progressive Web App (PWA) that fetches and displays your LPU timetable with automatic change detection and push notifications.



[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/itsrahulanshu/timelpu)[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/itsrahulanshu/timelpu)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](package.json)## ✨ Features



## ✨ Features- 🔄 **On-Demand Refresh**: Fetch your latest timetable with one click

- 🔔 **Push Notifications**: Get notified when your schedule changes

- 🚀 **Serverless Express Architecture** - Optimized for Vercel deployment- 📱 **PWA Support**: Install as a native app on mobile and desktop

- 📱 **Progressive Web App** - Install on any device, works offline- 🌙 **Dark Mode**: Easy on the eyes with built-in dark mode

- 🔄 **Auto Refresh** - Fetches latest timetable with captcha solving- 📊 **Clean UI**: Modern, responsive design that works on all devices

- ⏱️ **Rate Limiting** - 10-minute cooldown to save API costs- 🔒 **Secure**: Credentials stored as environment variables (never in code)

- 🔔 **Change Detection** - Notifies when timetable updates- ⚡ **Fast**: Smart caching for instant loading

- 🌙 **Dark Mode** - Easy on the eyes- ☁️ **Serverless**: Fully compatible with Vercel deployment

- 💾 **Smart Caching** - Reduces unnecessary API calls

- 🔐 **Secure Authentication** - Uses Anti-Captcha for LPU login## 🚀 Quick Deploy



---### Prerequisites



## 📋 Table of Contents1. **LPU Credentials** - Registration number and UMS password

2. **Anti-Captcha API Key** - Get from [anti-captcha.com](https://anti-captcha.com) (~$5 credit lasts months)

- [Prerequisites](#prerequisites)3. **GitHub Account** - [github.com](https://github.com)

- [Local Development Setup](#local-development-setup)4. **Vercel Account** - [vercel.com](https://vercel.com) (free tier)

- [Vercel Deployment](#vercel-deployment)

- [Environment Variables](#environment-variables)### Deploy in 3 Steps

- [Project Structure](#project-structure)

- [API Endpoints](#api-endpoints)1. **Push to GitHub**

- [Troubleshooting](#troubleshooting)   ```bash

- [Contributing](#contributing)   git clone https://github.com/itsrahulanshu/timelpu.git

   cd timelpu

---   git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

   git push -u origin main

## 🔧 Prerequisites   ```



Before you begin, ensure you have:2. **Import to Vercel**

   - Visit [vercel.com/new](https://vercel.com/new)

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)   - Import your GitHub repository

- **npm** (comes with Node.js)   - Add environment variables (see below)

- **Git** - [Download here](https://git-scm.com/)   - Click **Deploy**

- **LPU UMS Credentials** - Your university login

- **Anti-Captcha API Key** - [Get one here](https://anti-captcha.com/)3. **Set Environment Variables**

   

---   Go to: **Settings → Environment Variables**

   ```env

## 🚀 Local Development Setup   LPU_USERNAME=your_registration_number

   LPU_PASSWORD=your_password

### 1. Clone the Repository   ANTICAPTCHA_API_KEY=your_api_key

   ```

```bash

git clone https://github.com/itsrahulanshu/timelpu.git**Done!** 🎉 App live at `https://your-app.vercel.app`

cd timelpu

```## 📖 Documentation



### 2. Install Dependencies- **[Deployment Guide](docs/DEPLOYMENT.md)** - Step-by-step deployment instructions

- **[Architecture](docs/ARCHITECTURE.md)** - Technical details and system design

```bash- **[Quick Start](QUICKSTART.md)** - Get started in 5 minutes

npm install

```

## 🔧 Environment Variables

This will install:

- `express` - Web framework### Required

- `axios` - HTTP client

- `cheerio` - HTML parsing| Variable | Description | Example |

- `dotenv` - Environment variables|----------|-------------|---------|

- `@antiadmin/anticaptchaofficial` - Captcha solving| `LPU_USERNAME` | Your LPU registration number | `12345678` |

| `LPU_PASSWORD` | Your LPU UMS password | `YourPass@123` |

### 3. Configure Environment Variables| `ANTICAPTCHA_API_KEY` | Anti-Captcha API key | `abc123...` |



Create a `.env` file in the project root:### Optional



```bash| Variable | Description | Default |

cp .env.example .env|----------|-------------|---------|

```| `ONESIGNAL_APP_ID` | Push notification app ID | Pre-configured |

| `ONESIGNAL_REST_API_KEY` | Push notification API key | Pre-configured |

Edit `.env` and add your credentials:| `NODE_ENV` | Environment | `production` |



```env## 💻 Local Development

# LPU UMS Login Credentials

LPU_USERNAME=your_registration_number1. **Install dependencies**

LPU_PASSWORD=your_password   ```bash

   npm install

# Anti-Captcha API Key (get from https://anti-captcha.com/)   ```

ANTICAPTCHA_API_KEY=your_anticaptcha_api_key

2. **Create .env file**

# Optional: PWA Version   ```bash

PWA_VERSION=3.0.0   cp .env.example .env

   # Edit .env with your credentials

# Optional: Server Port (default: 3000)   ```

PORT=3000

```3. **Run development server**

   ```bash

### 4. Start Development Server   npm start

   ```

```bash

npm run dev4. **Open browser**

```   ```

   http://localhost:3000

The server will start at **http://localhost:3000**   ```



You should see:5. **Test endpoints**

   ```bash

```   # Health check

╔════════════════════════════════════════════════════════╗   curl http://localhost:3000/api/status

║  🚀 LPU Timetable - Development Server Running        ║   

╚════════════════════════════════════════════════════════╝   # Get timetable (cached)

   curl http://localhost:3000/api/timetable

📍 Local:     http://localhost:3000   

📍 Network:   http://0.0.0.0:3000   # Refresh timetable

   curl -X POST http://localhost:3000/api/refresh

📚 API Endpoints:   ```

   GET  /api/status      - Server status

   GET  /api/timetable   - Get cached timetable## 🏗️ Project Structure

   POST /api/refresh     - Refresh timetable

```

Press Ctrl+C to stoptimetable-main/

```├── api/                    # Serverless function handlers

│   ├── index.js           # Serves HTML frontend

### 5. Test the Application│   ├── status.js          # Health check endpoint

│   ├── timetable.js       # Get cached timetable

1. Open http://localhost:3000 in your browser│   └── refresh.js         # Fetch fresh timetable

2. Click the **Refresh** button (🔄) to fetch your timetable├── src/

3. Wait 15-20 seconds for captcha solving and data fetching│   ├── modules/           # Core business logic

4. Your timetable will appear!│   │   ├── auth.js        # LPU authentication

│   │   ├── timetable.js   # Timetable fetching

---│   │   ├── cache.js       # Caching layer

│   │   └── notifications.js # Push notifications

## ☁️ Vercel Deployment│   └── login.js           # LPU login automation

├── public/                # Static frontend files

### Method 1: Deploy Button (Easiest)│   ├── index.html         # Main UI

│   ├── assets/            # CSS, JS, icons

1. Click the **Deploy with Vercel** button above│   └── manifest.json      # PWA manifest

2. Fork/clone the repository to your GitHub├── docs/                  # Documentation

3. Connect your GitHub repository to Vercel│   ├── ARCHITECTURE.md    # System architecture

4. Configure environment variables (see below)│   └── DEPLOYMENT.md      # Deployment guide

5. Click **Deploy**└── vercel.json            # Vercel configuration

```

### Method 2: Manual Deployment

## 📱 How It Works

#### Step 1: Install Vercel CLI

1. **Authentication**: Automated login to LPU UMS using Anti-Captcha for solving captchas

```bash2. **Data Fetching**: Scrapes timetable HTML and extracts class information

npm install -g vercel3. **Caching**: Dual-layer caching (memory + file system) for fast responses

```4. **Change Detection**: Compares new data with cached data to detect schedule changes

5. **Notifications**: Sends push notifications via OneSignal when changes detected

#### Step 2: Login to Vercel6. **Display**: Clean, filterable UI with day-wise class view



```bash## ⚡ Performance

vercel login

```| Metric | Cold Start | Warm Start |

|--------|-----------|------------|

#### Step 3: Deploy| Status endpoint | ~500ms | <50ms |

| Cached timetable | ~800ms | <100ms |

```bash| Fresh refresh | 15-20s | 2-3s |

vercel

```## 🔒 Security



Follow the prompts:- ✅ HTTPS enforced (Vercel automatic)

- **Set up and deploy?** → Yes- ✅ Environment variables (never in code)

- **Which scope?** → Your account- ✅ `.env` in `.gitignore`

- **Link to existing project?** → No- ✅ CORS headers configured

- **Project name?** → lpu-timetable (or your choice)- ✅ Input validation on endpoints

- **Directory?** → `./` (current directory)- ✅ No sensitive data logged

- **Want to override settings?** → No

## 💰 Cost

#### Step 4: Configure Environment Variables

**Vercel** (Free Tier):

After deployment, add environment variables:- 100 GB bandwidth/month

- Unlimited function invocations

```bash- 100 GB-hrs compute/month

vercel env add LPU_USERNAME

vercel env add LPU_PASSWORD**Anti-Captcha**:

vercel env add ANTICAPTCHA_API_KEY- $0.001 per captcha

```- ~10 refreshes/day = $0.30/month



Or add them via the [Vercel Dashboard](https://vercel.com/):**Total: ~$0.30/month** ✅



1. Go to your project → **Settings** → **Environment Variables**## 🐛 Troubleshooting

2. Add each variable:

   - `LPU_USERNAME` → Your registration number### No timetable showing?

   - `LPU_PASSWORD` → Your password- Click the refresh button (🔄)

   - `ANTICAPTCHA_API_KEY` → Your Anti-Captcha API key- Wait 15-20 seconds for first load

   - `PWA_VERSION` → `3.0.0` (optional)

### Refresh not working?

#### Step 5: Redeploy with Environment Variables- Check Anti-Captcha balance > $0.001

- Verify environment variables in Vercel

```bash- Check function logs in Vercel Dashboard

vercel --prod

```### Using preview URL?

- Always use production URL (no random suffix)

Your app is now live! 🎉- Find it in Vercel Dashboard → Domains



---## 📄 License



## 🔐 Environment VariablesMIT License - See LICENSE file



| Variable | Required | Description | Example |## 🤝 Contributing

|----------|----------|-------------|---------|

| `LPU_USERNAME` | ✅ Yes | Your LPU registration number | `12524002` |Pull requests welcome! For major changes, open an issue first.

| `LPU_PASSWORD` | ✅ Yes | Your UMS password | `YourPassword123` |

| `ANTICAPTCHA_API_KEY` | ✅ Yes | Anti-Captcha API key | `a1b2c3d4e5f6...` |## ⭐ Show Your Support

| `PWA_VERSION` | ❌ No | App version for status endpoint | `3.0.0` |

| `PORT` | ❌ No | Local dev server port | `3000` |Give a ⭐️ if this project helped you!

| `NODE_ENV` | ❌ No | Environment (auto-set by Vercel) | `production` |

---

### Getting Anti-Captcha API Key

**Made with ❤️ for LPU students**

1. Sign up at [anti-captcha.com](https://anti-captcha.com/)

2. Add funds (~$1-2 for testing)   http://localhost:3000

3. Copy your API key from the dashboard   ```

4. Cost: ~$0.30/month for normal usage (10-min rate limit)

## 📱 Using the App

---

### Install as PWA

## 📁 Project Structure

**On Mobile (Android/iOS):**

```1. Open the app in Chrome/Safari

lpu-timetable/2. Tap menu (⋮) → "Add to Home Screen"

├── api/                      # Serverless functions3. App installs like a native app

│   ├── index.js             # Main Express app (entry point)

│   ├── status.js            # Health check endpoint**On Desktop (Chrome/Edge):**

│   ├── timetable.js         # Get cached timetable1. Look for install icon (➕) in address bar

│   └── refresh.js           # Refresh timetable data2. Click "Install"

├── public/                   # Static assets3. App opens in its own window

│   ├── index.html           # Main HTML file

│   ├── manifest.json        # PWA manifest### Enable Notifications

│   ├── sw.js                # Service worker

│   ├── OneSignalSDKWorker.js1. Allow notifications when prompted

│   └── assets/2. Receive updates when timetable changes

│       ├── css/3. Works even when app is closed

│       │   └── main.css     # Styles

│       ├── js/## 🏗️ Project Structure

│       │   └── app.js       # Frontend JavaScript

│       └── icons/           # PWA icons```

├── src/                      # Backend moduleslpu-timetable/

│   ├── modules/├── src/

│   │   ├── auth.js          # Authentication manager│   ├── server.js           # Main Express server

│   │   ├── cache.js         # Cache manager│   ├── login.js            # LPU authentication

│   │   ├── notifications.js # Notification manager│   ├── modules/

│   │   └── timetable.js     # Timetable manager│   │   ├── auth.js         # Session management

│   ├── data/                # Data storage (cache files)│   │   ├── timetable.js    # Timetable fetching

│   └── login.js             # LPU login automation│   │   ├── notifications.js # Push notifications

├── dev-server.js            # Local development server│   │   └── cache.js        # Data caching

├── package.json             # Dependencies and scripts│   └── data/               # Cache storage

├── vercel.json              # Vercel configuration├── public/

├── .env.example             # Environment variables template│   ├── index.html          # Main app interface

└── README.md                # This file│   ├── manifest.json       # PWA manifest

```│   ├── sw.js              # Service worker

│   └── assets/            # CSS, JS, icons

---├── vercel.json            # Vercel configuration

├── .env.example           # Environment template

## 🔌 API Endpoints└── how_to_deploy.html     # Deployment guide

```

### `GET /api/status`

## 🔍 Troubleshooting

**Description:** Check server health and version

### Deployment Failed

**Response:**- Verify all required environment variables are set

```json- Check Vercel deployment logs

{- Ensure no typos in variable names

  "success": true,

  "status": "running",### Timetable Not Loading

  "version": "3.0.0",- Verify LPU credentials are correct

  "timestamp": "2025-10-06T12:00:00.000Z",- Check Anti-Captcha API key and balance

  "environment": "production"- Check browser console for errors (F12)

}

```### Notifications Not Working

- Allow notifications in browser settings

---- Set ONESIGNAL_APP_ID and ONESIGNAL_API_KEY

- Update APP_URL to your Vercel URL

### `GET /api/timetable`

## 💡 Pro Tips

**Description:** Get cached timetable data

- ✅ Install as PWA for best experience

**Response (Success):**- ✅ Enable notifications for schedule updates

```json- ✅ Use dark mode to save battery

{- ✅ Keep Anti-Captcha account topped up

  "success": true,- ✅ Check balance monthly

  "data": [

    {## 🔒 Security

      "subject": "Computer Networks",

      "code": "CSE101",- ✅ Environment variables are encrypted on Vercel

      "faculty": "Dr. John Doe",- ✅ `.env` file is git-ignored

      "room": "32-501",- ✅ No credentials stored in code

      "date": "2025-10-06",- ✅ Session cookies are temporary

      "startTime": "09:00 AM",- ✅ HTTPS encryption on Vercel

      "endTime": "10:30 AM",

      "type": "Theory"## 💰 Cost Breakdown

    }

  ],| Service | Cost | Notes |

  "timestamp": "2025-10-06T08:30:00.000Z",|---------|------|-------|

  "totalClasses": 31| Vercel | FREE | Hobby plan for personal projects |

}| GitHub | FREE | Public repositories |

```| Anti-Captcha | ~$5 | Lasts several months |

| OneSignal | FREE | Up to 10,000 notifications/month |

**Response (No Data):**

```json**Total:** ~$5 one-time (lasts months)

{

  "success": false,## 📝 License

  "error": "No timetable data. Please refresh first.",

  "hint": "Click the refresh button (🔄) to fetch your timetable."MIT License - Feel free to use and modify!

}

```## 🤝 Contributing



---Contributions welcome! Feel free to:

- Report bugs

### `POST /api/refresh`- Suggest features

- Submit pull requests

**Description:** Fetch fresh timetable from LPU UMS

## ⚠️ Disclaimer

**Rate Limit:** 10 minutes between requests

This is an unofficial app not affiliated with LPU. Use at your own risk.

**Response (Success):**

```json---

{

  "success": true,Made with ❤️ for LPU Students | Deployed on Vercel ⚡

  "message": "Timetable refreshed successfully",
  "hasChanges": true,
  "data": [...],
  "timestamp": "2025-10-06T12:00:00.000Z"
}
```

**Response (Rate Limited):**
```json
{
  "success": false,
  "error": "Rate limit exceeded. Please wait before refreshing again.",
  "remainingTime": "You can refresh again in 8 minutes 32 seconds",
  "totalSeconds": 512
}
```

---

## 🛠️ Troubleshooting

### Issue: "Module not found: express"

**Solution:**
```bash
npm install
```

### Issue: "Error: ANTICAPTCHA_API_KEY not set"

**Solution:** Add your Anti-Captcha API key to `.env` file:
```env
ANTICAPTCHA_API_KEY=your_api_key_here
```

### Issue: "Authentication failed"

**Solution:**
1. Verify your LPU credentials in `.env`
2. Check if your UMS password is correct
3. Ensure Anti-Captcha API key is valid and has credits

### Issue: "Rate limit exceeded"

**Solution:** Wait 10 minutes between manual refreshes. This saves costs.

### Issue: Vercel deployment fails

**Solution:**
1. Ensure `vercel.json` is present
2. Check all environment variables are set in Vercel dashboard
3. Run `vercel --prod --force` to force redeploy
4. Check Vercel logs: `vercel logs`

### Issue: "No timetable data"

**Solution:**
1. Click the refresh button (🔄)
2. Wait 15-20 seconds for captcha solving
3. Check browser console for errors (F12)
4. Verify your LPU credentials

### Issue: Service worker not updating

**Solution:**
1. Unregister service worker: DevTools → Application → Service Workers → Unregister
2. Clear cache: DevTools → Application → Cache Storage → Delete all
3. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## 🎯 Production Optimization

### 1. Cost Optimization

The app includes a 10-minute rate limit to reduce Anti-Captcha costs:

- **Without rate limit:** ~$1.50/month (6 refreshes/hour)
- **With rate limit:** ~$0.30/month (1 refresh/10 min)
- **Savings:** 80% cost reduction

### 2. Caching Strategy

- Timetable data is cached in `src/data/`
- Cookies/session cached to avoid re-authentication
- Only fetches when user manually refreshes

### 3. Serverless Benefits

- ✅ Auto-scaling
- ✅ Zero server maintenance
- ✅ Pay only for actual usage
- ✅ Global CDN
- ✅ Automatic HTTPS

---

## 📝 Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Development** | `npm run dev` | Start local dev server |
| **Production** | `npm start` | Same as dev (for compatibility) |
| **Deploy** | `vercel --prod` | Deploy to production |
| **Preview** | `vercel` | Deploy preview version |
| **Logs** | `vercel logs` | View deployment logs |

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Rahul Anshu**
- GitHub: [@itsrahulanshu](https://github.com/itsrahulanshu)
- Repository: [timelpu](https://github.com/itsrahulanshu/timelpu)

---

## 🙏 Acknowledgments

- [Vercel](https://vercel.com/) - Hosting and serverless platform
- [Anti-Captcha](https://anti-captcha.com/) - Captcha solving service
- [Express.js](https://expressjs.com/) - Web framework
- LPU UMS - Timetable data source

---

## 📊 Project Status

- ✅ **Stable** - Ready for production use
- 🔄 **Active Development** - Regular updates
- 💚 **Maintained** - Issues and PRs reviewed regularly

---

## 🔗 Quick Links

- [Live Demo](https://timelpu.vercel.app/)
- [Report Bug](https://github.com/itsrahulanshu/timelpu/issues)
- [Request Feature](https://github.com/itsrahulanshu/timelpu/issues)

---

**⭐ If this project helped you, please give it a star on GitHub!**
