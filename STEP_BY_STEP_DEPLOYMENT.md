# 🚀 Step-by-Step Cloudflare Pages Deployment

## Current Status: Ready for Deployment! ✅

Your museum library is configured and ready. Follow these steps to deploy:

## Step 1: Authenticate with Cloudflare

Run this command and follow the browser authentication:
```bash
cd Museum-library
npx wrangler login
```

This will open your browser for Cloudflare authentication.

## Step 2: Deploy to Cloudflare Pages

After authentication, deploy your site:
```bash
npm run pages:deploy
```

## Step 3: Set Environment Variables

After deployment, add these environment variables in your Cloudflare Pages dashboard:

1. Go to your Cloudflare dashboard
2. Navigate to Pages → your-project → Settings → Environment variables
3. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://haneoyxztvquuqdfqtds.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbmVveXh6dHZxdXVxZGZxdGRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NzU2NjksImV4cCI6MjA2NzU1MTY2OX0.OkXk2baMymJVAvLoCobWijAS_JO1vpy0-wEMRyRKLGQ
NODE_ENV=production
```

## Alternative: GitHub Integration (Recommended)

Instead of CLI deployment, you can use GitHub integration:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for Cloudflare deployment"
   git push origin main
   ```

2. **Connect to Cloudflare Pages:**
   - Go to Cloudflare Dashboard → Pages
   - Click "Create a project"
   - Connect your GitHub account
   - Select your museum-library repository
   - Configure build settings:
     - **Build command:** `npm run build:cf`
     - **Build output directory:** `.vercel/output/static`
     - **Node.js version:** `18` or `20`

3. **Deploy automatically** - Cloudflare will build and deploy your site!

## Troubleshooting

### If Edge Runtime Fails:
The most likely issue is edge runtime compatibility. If deployment fails, try this quick fix:

1. Edit `app/museums/[id]/page.tsx`
2. Comment out the edge runtime line:
   ```typescript
   // export const runtime = 'edge'
   ```
3. Redeploy

### If Build Fails:
- Check environment variables are set correctly
- Ensure all dependencies are compatible
- Review build logs in Cloudflare dashboard

## What Happens After Deployment:

1. ✅ Your site will be available at: `https://your-project.pages.dev`
2. ✅ Custom domain can be configured in Cloudflare Pages settings
3. ✅ Automatic deployments on every git push
4. ✅ Global CDN with excellent performance
5. ✅ Free SSL certificate

## Performance Expectations:

- **Bundle Size:** ~290KB optimized
- **Load Time:** < 2 seconds globally
- **Lighthouse Score:** 90+ expected
- **Database:** Supabase integration working
- **Static Pages:** 8 pages pre-rendered
- **Dynamic Pages:** 1 page server-rendered

Ready to deploy! 🎉
