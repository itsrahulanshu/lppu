# 🚀 Quick Reference Card - LPU Timetable v3.0.0

## 📦 Installation

```bash
git clone https://github.com/itsrahulanshu/timelpu.git
cd timelpu
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

## 🔑 Environment Variables

```env
LPU_USERNAME=12524002
LPU_PASSWORD=your_password
ANTICAPTCHA_API_KEY=your_api_key
PWA_VERSION=3.0.0
PORT=3000
```

## 🛠️ NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local development server |
| `npm start` | Same as dev (alias) |

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/status` | GET | Server health check |
| `/api/timetable` | GET | Get cached timetable |
| `/api/refresh` | POST/GET | Fetch fresh timetable |
| `/` | GET | Main app (index.html) |
| `/assets/*` | GET | Static files |

## 🚀 Vercel Deployment

### Quick Deploy
```bash
vercel --prod
```

### With Environment Variables
```bash
vercel env add LPU_USERNAME
vercel env add LPU_PASSWORD
vercel env add ANTICAPTCHA_API_KEY
vercel --prod --force
```

### Useful Commands
```bash
vercel ls              # List deployments
vercel logs            # View logs
vercel rollback        # Rollback deployment
vercel inspect [url]   # Inspect deployment
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `api/index.js` | Express app (entry point) |
| `vercel.json` | Vercel configuration |
| `package.json` | Dependencies & scripts |
| `dev-server.js` | Local development server |
| `.env` | Environment variables (gitignored) |
| `README.md` | Full documentation |

## 🎯 Project Structure

```
api/index.js        ← Single entry point (Express app)
  ├── GET /api/status
  ├── GET /api/timetable
  ├── POST /api/refresh
  ├── Static files (/assets, /public)
  └── Fallback (/* → index.html)
```

## ⚙️ Vercel Configuration

```json
{
  "builds": [{"src": "api/index.js", "use": "@vercel/node"}],
  "routes": [{"src": "/(.*)", "dest": "api/index.js"}],
  "functions": {
    "api/index.js": {"memory": 1024, "maxDuration": 60}
  }
}
```

## 🧪 Testing

### Local Testing
```bash
npm run dev
# Open http://localhost:3000
# Test endpoints:
curl http://localhost:3000/api/status
curl http://localhost:3000/api/timetable
```

### Browser Testing
1. Open http://localhost:3000
2. Click refresh button (🔄)
3. Wait 15-20 seconds
4. Timetable should load

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Module not found | `npm install` |
| Authentication failed | Check `.env` credentials |
| Rate limit | Wait 10 minutes |
| Build fails | Check `vercel logs` |
| No timetable | Click refresh button |

## 📊 Tech Stack

- **Backend:** Node.js + Express.js
- **Frontend:** Vanilla JavaScript
- **Deployment:** Vercel (serverless)
- **Authentication:** Anti-Captcha API
- **Caching:** File-based (src/data/)
- **PWA:** Service Worker + Manifest

## 💰 Costs

- **Vercel:** $0 (Free tier)
- **Anti-Captcha:** ~$0.30/month
- **Total:** ~$0.30/month

## 📚 Documentation

1. **README.md** - Complete setup guide
2. **DEPLOYMENT_READY.md** - Deployment checklist
3. **MIGRATION_SUMMARY.md** - Technical details
4. **PROJECT_COMPLETE.md** - Final report
5. **QUICK_REFERENCE.md** - This file

## 🔗 Important Links

- **Repository:** https://github.com/itsrahulanshu/timelpu
- **Live Demo:** https://timelpu.vercel.app
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Anti-Captcha:** https://anti-captcha.com

## ✅ Pre-Deploy Checklist

- [ ] Environment variables set
- [ ] `.env` not committed to git
- [ ] `npm install` successful
- [ ] `npm run dev` works locally
- [ ] All endpoints tested
- [ ] No console errors

## 🎯 Success Criteria

- ✅ Single entry point at `api/index.js`
- ✅ Express app configured
- ✅ Vercel.json simplified
- ✅ All routes working
- ✅ Static files served
- ✅ No manual configuration needed

## 🚀 Deploy Now!

```bash
vercel --prod
```

---

**Version:** 3.0.0  
**Status:** Production Ready  
**Last Updated:** October 6, 2025
