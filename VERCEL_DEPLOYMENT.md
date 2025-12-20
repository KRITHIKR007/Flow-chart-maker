# Diagram Generator - Vercel Deployment Guide

## Quick Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KRITHIKR007/Flow-chart-maker&env=HUGGINGFACE_API_KEY&envDescription=Hugging%20Face%20API%20Key%20for%20AI%20diagram%20generation&envLink=https://huggingface.co/settings/tokens)

### Manual Deployment Steps

1. **Push to GitHub** (if not already done):
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure environment variables (see below)
   - Click "Deploy"

3. **Environment Variables**:

In Vercel dashboard, add the following environment variable:

| Name | Value | Description |
|------|-------|-------------|
| `HUGGINGFACE_API_KEY` | `hf_...` | Your Hugging Face API token |

Get your free Hugging Face token at: https://huggingface.co/settings/tokens

4. **Domain Setup** (Optional):
   - Vercel provides a free `.vercel.app` domain
   - Add custom domain in project settings if desired

## Build Configuration

The project is pre-configured for Vercel with:

- **Framework**: Next.js 14 (App Router)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Node Version**: 18.x (automatic)

## Environment Variables

### Required
- `HUGGINGFACE_API_KEY` - Hugging Face API token for AI generation

### How to Get Hugging Face API Key

1. Sign up at [huggingface.co](https://huggingface.co)
2. Go to [Settings > Access Tokens](https://huggingface.co/settings/tokens)
3. Click "New token"
4. Give it a name (e.g., "Diagram Generator")
5. Select "read" permissions
6. Copy the token (starts with `hf_`)
7. Add to Vercel environment variables

## Vercel-Specific Features

### Automatic Deployments
- Every push to `main` branch triggers a production deployment
- Pull requests get preview deployments
- Instant rollback available

### Performance Optimization
- Edge caching enabled
- Image optimization via Next.js
- Automatic HTTPS
- Global CDN distribution

### Monitoring
- Real-time analytics in Vercel dashboard
- Error tracking
- Performance metrics

## Troubleshooting Vercel Deployment

### Build Fails

**Error: Missing environment variables**
- Solution: Add `HUGGINGFACE_API_KEY` in Vercel dashboard under Settings > Environment Variables

**Error: Module not found**
- Solution: Ensure all dependencies are in `package.json`, not just `devDependencies`
- Run `npm install` locally to verify

**Error: Build timeout**
- Solution: Optimize build by removing unused dependencies
- Check for infinite loops in API routes

### Runtime Errors

**API returns 500**
- Check Vercel function logs in dashboard
- Verify `HUGGINGFACE_API_KEY` is set correctly
- Ensure API key has correct permissions

**Images not loading**
- Verify CORS settings for uploaded images
- Check Vercel function timeout (default 10s, max 60s on Pro)

### Performance Issues

**Slow API responses**
- Hugging Face API cold starts can take 5-10s
- Consider using a warmer model or caching strategy
- Upgrade to Vercel Pro for longer timeouts if needed

## Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] App loads successfully
- [ ] Test diagram generation
- [ ] Test all export functions (PNG, SVG)
- [ ] Verify theme switching works
- [ ] Test on mobile devices
- [ ] Check browser console for errors
- [ ] Verify all keyboard shortcuts work

## Updating the Deployment

To deploy updates:

```bash
git add .
git commit -m "Update: description of changes"
git push origin main
```

Vercel will automatically build and deploy the changes.

## Custom Domain Setup

1. Go to your Vercel project dashboard
2. Click "Settings" > "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Wait for DNS propagation (can take up to 48 hours)

## Cost Considerations

**Free Tier Includes:**
- Unlimited deployments
- 100GB bandwidth/month
- Serverless function executions
- Automatic HTTPS
- Preview deployments

**Note:** Hugging Face API is also free for moderate usage. Monitor your usage in the Hugging Face dashboard.

## Support

For Vercel-specific issues:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)

For app-specific issues:
- Open an issue on [GitHub](https://github.com/KRITHIKR007/Flow-chart-maker/issues)

---

**Deployed and ready to use! 🚀**
