# ✅ Vercel Deployment Checklist

## Pre-Deployment Verification

### 1. Project Structure ✅
- [x] Express app at `api/index.js` (single entry point)
- [x] All API routes defined in Express app
- [x] Static files in `public/` directory
- [x] Backend modules in `src/` directory
- [x] Development server (`dev-server.js`)

### 2. Dependencies ✅
- [x] `express@^4.18.2` installed
- [x] `axios`, `cheerio`, `dotenv` installed
- [x] `@antiadmin/anticaptchaofficial` installed
- [x] No unused dependencies
- [x] `package-lock.json` present

### 3. Configuration Files ✅
- [x] `vercel.json` properly configured
- [x] `.env.example` template created
- [x] `.gitignore` includes `.env`
- [x] `.vercelignore` configured

### 4. Environment Variables Required
- [ ] `LPU_USERNAME` - Your LPU registration number
- [ ] `LPU_PASSWORD` - Your UMS password
- [ ] `ANTICAPTCHA_API_KEY` - Anti-Captcha API key
- [ ] `PWA_VERSION` - Optional (default: 3.0.0)

---

## Vercel Configuration

### vercel.json Breakdown

```json
{
  "version": 2,
  "name": "lpu-timetable",
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.js"
    }
  ],
  "functions": {
    "api/index.js": {
      "memory": 1024,
      "maxDuration": 60
    }
  },
  "env": {
    "NODE_ENV": "production"
  }
}
```

**What this does:**
- ✅ Uses `@vercel/node` builder for Express
- ✅ Routes ALL traffic to single entry point
- ✅ Sets 1024MB memory (for captcha solving)
- ✅ Sets 60s timeout (sufficient for authentication)
- ✅ Sets production environment

---

## Deployment Steps

### Method 1: GitHub → Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Refactor to serverless Express architecture"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com/)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel auto-detects settings from `vercel.json`

3. **Configure Environment Variables:**
   - In Vercel dashboard: Settings → Environment Variables
   - Add:
     - `LPU_USERNAME` = your registration number
     - `LPU_PASSWORD` = your password
     - `ANTICAPTCHA_API_KEY` = your API key

4. **Deploy:**
   - Click "Deploy"
   - Wait ~1-2 minutes
   - Visit your production URL!

### Method 2: Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Add Environment Variables:**
   ```bash
   vercel env add LPU_USERNAME
   vercel env add LPU_PASSWORD
   vercel env add ANTICAPTCHA_API_KEY
   ```

5. **Redeploy with env vars:**
   ```bash
   vercel --prod --force
   ```

---

## Testing Deployment

### 1. Check Build Logs
```bash
vercel logs
```

Look for:
- ✅ "Build successful"
- ✅ No module errors
- ✅ Express app starts correctly

### 2. Test API Endpoints

**Status:**
```bash
curl https://your-app.vercel.app/api/status
```

Expected:
```json
{
  "success": true,
  "status": "running",
  "version": "3.0.0",
  "timestamp": "...",
  "environment": "production"
}
```

**Timetable (will be empty initially):**
```bash
curl https://your-app.vercel.app/api/timetable
```

Expected:
```json
{
  "success": false,
  "error": "No timetable data. Please refresh first.",
  "hint": "Click the refresh button (🔄) to fetch your timetable."
}
```

**Home Page:**
```bash
curl https://your-app.vercel.app/
```

Expected: HTML content with status 200

### 3. Test in Browser

1. Visit your Vercel URL
2. Click refresh button (🔄)
3. Wait 15-20 seconds
4. Timetable should load

---

## Troubleshooting

### Build Fails

**Error:** `Cannot find module 'express'`
```bash
# Solution: Verify package.json has express in dependencies
npm install
git add package-lock.json
git commit -m "Add package-lock.json"
git push
```

**Error:** `FUNCTION_INVOCATION_TIMEOUT`
```json
// Solution: Increase maxDuration in vercel.json
{
  "functions": {
    "api/index.js": {
      "maxDuration": 60  // Already set to 60s
    }
  }
}
```

### Runtime Errors

**Error:** `ANTICAPTCHA_API_KEY not set`
```bash
# Solution: Add environment variable in Vercel dashboard
# Settings → Environment Variables → Add
```

**Error:** `Authentication failed`
- Verify LPU credentials in environment variables
- Check Anti-Captcha balance
- View Vercel logs: `vercel logs`

### Static Files Not Loading

**Issue:** CSS/JS not loading

**Solution:** Verify Express static middleware in `api/index.js`:
```javascript
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));
app.use(express.static(path.join(__dirname, '../public')));
```

---

## Performance Optimization

### 1. Cold Start Reduction
- Express app uses singleton pattern for managers
- Reuses warm function instances when possible
- First request: ~2-3s, Subsequent: ~100-300ms

### 2. Memory Usage
- Set to 1024MB (captcha solving needs memory)
- Typical usage: ~150-300MB
- Peak during refresh: ~500MB

### 3. Cost Estimation

**Vercel:**
- Free tier: 100GB bandwidth, 100GB-hours compute
- Typical usage: ~10-20 requests/day = well within free tier

**Anti-Captcha:**
- With 10-min rate limit: ~$0.30/month
- Without rate limit: ~$1.50/month

---

## Monitoring

### Check Deployment Status
```bash
vercel ls
```

### View Recent Logs
```bash
vercel logs --follow
```

### Inspect Build
```bash
vercel inspect [deployment-url]
```

---

## Post-Deployment

### 1. Set Custom Domain (Optional)
1. Go to Vercel dashboard
2. Settings → Domains
3. Add your domain
4. Update DNS records

### 2. Enable Analytics (Optional)
1. Vercel dashboard → Analytics
2. Enable Web Analytics
3. View traffic stats

### 3. Set Up Monitoring
- Enable error tracking
- Set up Slack/email notifications
- Monitor function duration

---

## Rollback (If Needed)

### Quick Rollback
```bash
vercel rollback [deployment-url]
```

### Or via Dashboard
1. Go to Deployments tab
2. Find previous working deployment
3. Click "Promote to Production"

---

## Success Criteria

Your deployment is successful when:

- ✅ Build completes without errors
- ✅ `/api/status` returns 200
- ✅ Home page loads correctly
- ✅ Refresh button fetches timetable
- ✅ No console errors in browser
- ✅ Service worker registers
- ✅ PWA installable
- ✅ Dark mode works
- ✅ Rate limiting functions

---

## Next Steps After Deployment

1. **Test thoroughly:**
   - Refresh multiple times (test rate limit)
   - Toggle dark mode
   - Install as PWA
   - Test on mobile

2. **Monitor costs:**
   - Check Anti-Captcha usage
   - Monitor Vercel bandwidth

3. **Share:**
   - Share app URL with classmates
   - Get feedback
   - Iterate on features

---

## Quick Reference

### Key URLs
- **Production:** `https://your-app.vercel.app`
- **Vercel Dashboard:** `https://vercel.com/dashboard`
- **GitHub Repo:** `https://github.com/itsrahulanshu/timelpu`

### Commands
```bash
# Deploy
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls

# Rollback
vercel rollback

# Local test
npm run dev
```

---

**🎉 Your serverless Express app is now ready for deployment!**
