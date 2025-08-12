# Museum Library - Supabase Setup Guide

This guide will help you set up PostgreSQL with Supabase for your Museum Library application.

## Prerequisites

- A Supabase account (free tier available at [supabase.com](https://supabase.com))
- Node.js 18+ and npm/pnpm installed

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization and enter:
   - Project name: `museum-library`
   - Database password: (generate a secure password)
   - Region: Choose closest to your location
4. Wait for the project to be created (~2 minutes)

### 2. Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - **service_role** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 3. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` with your Supabase credentials:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

   # Database Configuration
   NEXT_PUBLIC_USE_DATABASE=true
   NEXT_PUBLIC_API_URL=http://localhost:3001/api

   # Application Configuration
   NEXTAUTH_SECRET=your_random_secret_here
   NEXTAUTH_URL=http://localhost:3001
   ```

### 4. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `database/schema.sql`
3. Paste it into the SQL editor and click **Run**
4. This will create all necessary tables, indexes, and policies

### 5. Seed the Database (Optional)

Run the seeding script to populate your database with sample data:

```bash
npm run seed-database
```

### 6. Install Dependencies and Start Development

```bash
npm install
npm run dev
```

Your application will now use Supabase as the database backend!

## Database Schema Overview

The database includes the following main tables:

- **museums**: Core museum information and metadata
- **artists**: Artist profiles and biographical data
- **artworks**: Individual artwork records linked to museums and artists
- **exhibits**: Current and upcoming exhibitions
- **users**: User profiles and preferences
- **reviews**: User reviews and ratings
- **review_replies**: Replies to reviews (including museum staff responses)

## Features

### Row Level Security (RLS)
- All tables have RLS enabled for security
- Public read access for museums, artists, artworks, and exhibits
- User-specific access for reviews and profile data

### Full-Text Search
- French language full-text search on museums, artworks, and artists
- Optimized indexes for fast search performance

### Automatic Triggers
- Auto-updating `updated_at` timestamps
- Automatic counts for artist artworks and user reviews

### Data Validation
- Comprehensive check constraints for data integrity
- Proper foreign key relationships

## Development vs Production

### Development Mode
- Set `NEXT_PUBLIC_USE_DATABASE=false` to use mock data
- Useful for development without database setup

### Production Mode
- Set `NEXT_PUBLIC_USE_DATABASE=true` to use Supabase
- Automatic fallback to mock data if database is unavailable

## API Endpoints

With database enabled, the following API endpoints are available:

- `GET /api/museums` - List museums with filtering and pagination
- `GET /api/museums/[id]` - Get specific museum details
- `GET /api/artworks` - List artworks with filtering
- `GET /api/artists` - List artists
- `GET /api/reviews` - Museum reviews and ratings

## Troubleshooting

### Database Connection Issues
1. Verify your environment variables are correct
2. Check that your Supabase project is active
3. Ensure your IP is not blocked (Supabase has no IP restrictions by default)

### Schema Issues
1. Make sure you ran the complete schema script
2. Check the Supabase logs in the dashboard for errors
3. Verify all tables were created successfully

### RLS Policies
If you have access issues:
1. Check the Row Level Security policies in the Supabase dashboard
2. Ensure policies allow the operations you're trying to perform
3. Consider temporarily disabling RLS for debugging (not recommended for production)

## Security Considerations

- Never expose your `service_role` key in client-side code
- Use the `anon` key for client-side operations
- RLS policies protect sensitive data
- All API routes validate and sanitize input

## Performance Tips

- The database includes optimized indexes for common queries
- Use pagination for large result sets
- Consider caching frequently accessed data
- Monitor query performance in Supabase dashboard

## Backup and Migration

Supabase provides automatic daily backups for paid plans. For the free tier:
1. Regular exports via Supabase dashboard
2. Use the provided migration scripts for schema changes
3. Consider upgrading for production applications

## Support

- Supabase Documentation: [docs.supabase.com](https://docs.supabase.com)
- Community Support: [Supabase Discord](https://discord.supabase.com)
- Project Issues: Create an issue in this repository




# Cloudflare Deployment Guide for Museum Library

This guide explains how to deploy your database-integrated Museum Library to Cloudflare Pages.

## Prerequisites

- Existing Cloudflare Pages deployment
- Supabase project set up (follow main README.md first)
- Git repository connected to Cloudflare Pages

## Step 1: Configure Environment Variables in Cloudflare

1. **Go to Cloudflare Dashboard**
   - Navigate to your Cloudflare Pages project
   - Go to **Settings** → **Environment variables**

2. **Add Production Environment Variables**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   NEXT_PUBLIC_USE_DATABASE=true
   NEXT_PUBLIC_API_URL=https://your-site.pages.dev/api
   NEXTAUTH_SECRET=your_random_secret_here
   NEXTAUTH_URL=https://your-site.pages.dev
   ```

3. **Set Environment for Production**
   - Make sure these are set for **Production** environment
   - Optionally set different values for **Preview** if needed

## Step 2: Update Your Repository

1. **Commit and Push Changes**
   ```bash
   git add .
   git commit -m "Add Supabase database integration"
   git push origin main
   ```

2. **Cloudflare will automatically detect the changes and redeploy**

## Step 3: Set Up Database Schema

Since this is a one-time setup, you'll do this directly in Supabase:

1. **In Supabase Dashboard**
   - Go to **SQL Editor**
   - Copy the contents of `database/schema.sql`
   - Paste and run the script

2. **Seed the Database (Optional)**
   - You can run the seeding script locally:
   ```bash
   npm run seed-database
   ```
   - Or manually insert data through Supabase dashboard

## Step 4: Configure Build Settings (if needed)

Your `wrangler.toml` should already be configured, but ensure it includes:

```toml
name = "museum-library"
compatibility_date = "2024-01-01"
pages_build_output_dir = ".vercel/output/static"

[env.production.vars]
NEXT_PUBLIC_USE_DATABASE = "true"
```

## Step 5: Verify Deployment

1. **Check Build Logs**
   - In Cloudflare Pages dashboard, check the deployment logs
   - Ensure no build errors related to the new database code

2. **Test Database Connection**
   - Visit your deployed site
   - Check if museums load (should now come from Supabase)
   - Test search and filtering functionality

## Environment Variable Management

### Development vs Production

- **Local Development**: Uses `.env.local`
- **Cloudflare Production**: Uses Cloudflare environment variables
- **Automatic Fallback**: If database fails, falls back to mock data

### Security Best Practices

1. **Never expose Service Role Key in client-side code**
2. **Use different Supabase projects for staging/production**
3. **Regularly rotate API keys**
4. **Monitor usage in Supabase dashboard**

## Troubleshooting Cloudflare Deployment

### Build Errors

1. **Missing Dependencies**
   ```bash
   # Make sure package.json includes all dependencies
   npm install
   ```

2. **TypeScript Errors**
   ```bash
   # Check types
   npm run type-check
   ```

### Runtime Errors

1. **Environment Variables Not Set**
   - Double-check all variables in Cloudflare dashboard
   - Ensure no typos in variable names

2. **Database Connection Issues**
   - Verify Supabase project is active
   - Check API keys are correct
   - Review Supabase logs for errors

### Performance Issues

1. **Cold Starts**
   - Cloudflare functions may have cold start delays
   - Consider implementing caching strategies

2. **Database Queries**
   - Monitor query performance in Supabase
   - Ensure proper indexing is in place

## Advanced Configuration

### Custom API Routes

Your API routes (`app/api/museums/route.ts`, etc.) will automatically work with Cloudflare Pages functions.

### Edge Runtime (Optional)

For better performance, you can configure edge runtime:

```typescript
// In your API routes
export const runtime = 'edge'
```

### Caching Strategies

Consider implementing caching for better performance:

```typescript
// Example cache headers
export async function GET() {
  const data = await databaseService.getMuseums()
  
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
    }
  })
}
```

## Monitoring and Maintenance

### Supabase Monitoring

1. **Dashboard Metrics**
   - Monitor database usage
   - Check API request counts
   - Review error logs

2. **Performance Tracking**
   - Query execution times
   - Connection pool usage
   - Storage usage

### Cloudflare Analytics

1. **Pages Analytics**
   - Monitor site performance
   - Track user engagement
   - Review error rates

2. **Functions Analytics**
   - API endpoint performance
   - Function execution times
   - Error rates

## Backup and Recovery

### Database Backups

1. **Automatic Backups** (Paid Supabase plans)
   - Daily automated backups
   - Point-in-time recovery

2. **Manual Exports** (Free tier)
   - Regular database exports
   - Download via Supabase dashboard

### Code Backups

1. **Git Repository**
   - Regular commits to version control
   - Tag stable releases

2. **Cloudflare Rollback**
   - Use Cloudflare's rollback feature if needed
   - Keep track of working deployments

## Scaling Considerations

### Database Scaling

1. **Supabase Limits**
   - Monitor usage against plan limits
   - Consider upgrading plans as needed

2. **Connection Pooling**
   - Already handled by Supabase
   - Monitor connection usage

### Frontend Scaling

1. **Cloudflare CDN**
   - Automatic global distribution
   - Edge caching for static assets

2. **Function Limits**
   - Monitor function execution times
   - Optimize heavy operations

## Support and Resources

- **Cloudflare Pages Documentation**: [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages)
- **Supabase Documentation**: [docs.supabase.com](https://docs.supabase.com)
- **Next.js on Cloudflare**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)

## Quick Deployment Checklist

- [ ] Supabase project created and configured
- [ ] Database schema deployed
- [ ] Environment variables set in Cloudflare
- [ ] Code committed and pushed to repository
- [ ] Cloudflare deployment completed successfully
- [ ] Database connection verified on live site
- [ ] Search and filtering functionality tested
- [ ] Performance and error monitoring set up
