# Image Upload Setup Guide

Your e-commerce platform now supports **direct image uploads** through the UI using ImgBB (free image hosting).

## Quick Setup (5 minutes)

### 1. Get Your Free ImgBB API Key

1. Go to https://api.imgbb.com/
2. Click "Get API Key" (no credit card required)
3. Sign up with email or social login
4. Copy your API key

### 2. Add API Key to Your Project

Open `components/admin/ImageUpload.tsx` and replace the API key on line 17:

```typescript
const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your ImgBB API key
```

### 3. That's it!

Now you can:
- **Drag & drop** images directly in the admin panel
- **Click to upload** multiple images at once
- Images are automatically hosted on ImgBB's CDN
- **Still paste URLs** if you prefer (Unsplash, etc.)

## ImgBB Free Tier Limits

- ✅ **Unlimited** storage
- ✅ **Unlimited** bandwidth
- ✅ Up to **32MB** per image
- ✅ Direct hotlinking allowed
- ✅ No expiration

## Alternative Options

### Option 1: Cloudinary (Recommended for larger stores)
- **Free tier**: 25GB storage, 25GB bandwidth/month
- Better image optimization
- Automatic transformations

**Setup**:
1. Sign up at https://cloudinary.com
2. Install package: `npm install cloudinary`
3. Replace the `uploadToImgBB` function with Cloudinary's upload

### Option 2: Uploadcare
- **Free tier**: 3GB storage, 30GB bandwidth/month
- File CDN with built-in image processing

### Option 3: Keep using URLs
- If you prefer, just paste image URLs (Unsplash, Google Drive, etc.)
- The upload feature is optional!

## Security Notes

- The API key is **client-side** (visible in browser)
- This is normal for ImgBB's free tier
- For production, consider server-side uploads
- Rate limit: 5000 requests/hour per IP

## Troubleshooting

**Upload fails?**
- Check file size (max 5MB in code, but ImgBB supports up to 32MB)
- Check file type (must be image: jpg, png, gif, etc.)
- Verify API key is correct

**Need server-side upload?**
- Create an API route in `app/api/upload/route.ts`
- Move API key to `.env.local`
- Call this endpoint from ImageUpload component
