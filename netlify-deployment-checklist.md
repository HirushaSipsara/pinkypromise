# Netlify Deployment Checklist

## Pre-Deployment Checklist

### ✅ Code Preparation

- [ ] All code is committed to GitHub
- [ ] netlify.toml is present and configured
- [ ] Environment variables are externalized in api.ts
- [ ] Build command works locally: `npm run build`

### ✅ Backend Ready

- [ ] Backend is deployed to Railway
- [ ] Backend URL is available
- [ ] API endpoints are working

## Netlify Deployment Steps

### 1. Connect GitHub

- [ ] Sign up at netlify.com with GitHub
- [ ] Authorize Netlify to access your repositories

### 2. Create New Site

- [ ] Click "New site from Git"
- [ ] Choose "GitHub" as provider
- [ ] Select your repository

### 3. Configure Build Settings

Set the following in Netlify:

```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist
```

### 4. Configure Environment Variables

In Netlify dashboard → Site settings → Environment variables:

```
VITE_API_BASE_URL=https://your-backend-name.railway.app/api
```

### 5. Deploy

- [ ] Click "Deploy site"
- [ ] Monitor build logs
- [ ] Wait for deployment to complete

### 6. Test Deployment

- [ ] Visit your Netlify site URL
- [ ] Test application functionality
- [ ] Verify API calls are working
- [ ] Check browser console for errors

## Post-Deployment

### ✅ Get Frontend URL

- [ ] Copy the Netlify site URL
- [ ] Note the URL format: `https://your-site-name.netlify.app`

### ✅ Update Backend CORS

- [ ] Add Netlify domain to CORS configuration
- [ ] Update Spring Boot CORS settings
- [ ] Redeploy backend if needed

## Build Configuration

### netlify.toml

```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Environment Variables

```bash
# Required
VITE_API_BASE_URL=https://your-backend.railway.app/api

# Optional (for development)
NODE_ENV=production
```

## Troubleshooting

### Build Failures

- Check Node.js version (should be 18+)
- Verify all dependencies are in package.json
- Check for TypeScript errors
- Verify build command works locally

### Runtime Issues

- Check environment variables are set
- Verify API_BASE_URL is correct
- Check browser console for CORS errors
- Test API endpoints directly

### CORS Issues

- Ensure backend CORS includes Netlify domain
- Check if backend is accessible from browser
- Verify HTTPS is used for both frontend and backend

## Useful Commands

```bash
# Test build locally
cd frontend
npm run build

# Test preview locally
npm run preview

# Check environment variables
echo $VITE_API_BASE_URL
```

## Environment Variables Reference

| Variable            | Description     | Example                            |
| ------------------- | --------------- | ---------------------------------- |
| `VITE_API_BASE_URL` | Backend API URL | `https://your-app.railway.app/api` |

## Performance Optimization

### Netlify Settings

- [ ] Enable asset optimization
- [ ] Configure caching headers
- [ ] Set up CDN
- [ ] Enable compression

### Build Optimization

- [ ] Minimize bundle size
- [ ] Optimize images
- [ ] Use code splitting
- [ ] Enable tree shaking

## Security Considerations

- [ ] Use HTTPS for all requests
- [ ] Validate environment variables
- [ ] Implement proper error handling
- [ ] Use secure authentication

## Monitoring

### Netlify Analytics

- [ ] Enable Netlify Analytics
- [ ] Monitor site performance
- [ ] Track build times
- [ ] Monitor error rates

### Application Monitoring

- [ ] Set up error tracking
- [ ] Monitor API response times
- [ ] Track user interactions
- [ ] Monitor build success rates

## Next Steps

1. ✅ Frontend deployed to Netlify
2. ⏳ Update backend CORS settings
3. ⏳ Test full application flow
4. ⏳ Set up custom domain (optional)
5. ⏳ Configure monitoring and analytics

## Custom Domain (Optional)

### DNS Configuration

- [ ] Add custom domain in Netlify
- [ ] Configure DNS records
- [ ] Enable HTTPS certificate
- [ ] Test domain resolution

### SSL Certificate

- [ ] Netlify automatically provides SSL
- [ ] Verify certificate is active
- [ ] Test HTTPS redirects
- [ ] Update any hardcoded URLs
