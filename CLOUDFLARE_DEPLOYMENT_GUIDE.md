# Cloudflare Pages Deployment Guide

## ✅ Configuration Status

### Fixed Issues:
- ✅ Added `@cloudflare/next-on-pages` dependency
- ✅ Updated `wrangler.toml` with correct build output directory
- ✅ Fixed package.json build scripts
- ✅ Added edge runtime configuration to dynamic routes
- ✅ Updated Next.js configuration for Cloudflare compatibility

### Remaining Issue:
- ⚠️ **Edge Runtime Compatibility**: Some dependencies may not be fully compatible with Cloudflare's edge runtime

## 🚀 Deployment Steps

### 1. Local Build Test
```bash
npm run build:cf
```

### 2. Preview Locally
```bash
npm run preview
```

### 3. Deploy to Cloudflare Pages

#### Option A: Using Wrangler CLI
```bash
npm run pages:deploy
```

#### Option B: GitHub Integration
1. Push your code to GitHub
2. Connect your repository to Cloudflare Pages
3. Set build command: `npm run build:cf`
4. Set output directory: `.vercel/output/static`

### 4. Environment Variables
Add these in Cloudflare Pages dashboard:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NODE_ENV=production
```

## 🔧 Troubleshooting

### Edge Runtime Issues
If you encounter "self is not defined" or similar errors:

1. **Option 1: Use Node.js runtime instead of edge**
   Remove `export const runtime = 'edge'` from `app/museums/[id]/page.tsx`

2. **Option 2: Add runtime polyfills**
   Install and configure edge runtime polyfills

### Build Issues
- Ensure all dependencies are compatible with edge runtime
- Check that environment variables are properly configured
- Verify that dynamic imports work correctly

## 📊 Current Build Analysis
- **Bundle Size**: ~290KB average first load
- **Static Pages**: 8 pages pre-rendered successfully
- **Dynamic Pages**: 1 page (`/museums/[id]`) configured for edge runtime
- **Optimization**: Code splitting and vendor chunks configured

## 🎯 Next Steps
1. Test deployment with static export if edge runtime continues to fail
2. Consider using ISR (Incremental Static Regeneration) for better performance
3. Set up monitoring and analytics after deployment
4. Configure custom domain and SSL
