# Deployment Guide 🚀

## Quick Start - Deploy to Netlify

### Option 1: Deploy via Netlify CLI (Recommended)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Netlify CLI globally (if you haven't already):**
   ```bash
   npm install -g netlify-cli
   ```

3. **Login to Netlify:**
   ```bash
   netlify login
   ```

4. **Initialize your site:**
   ```bash
   netlify init
   ```
   
   Follow the prompts:
   - Create & configure a new site
   - Choose your team
   - Give your site a name (or let Netlify generate one)
   - Accept the default build settings

5. **Deploy to production:**
   ```bash
   netlify deploy --prod
   ```

6. **Done!** Your app will be live at your Netlify URL (e.g., `https://your-site-name.netlify.app`)

### Option 2: Deploy via Netlify Web UI

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Go to [Netlify](https://app.netlify.com) and click "Add new site"**

3. **Connect your repository**

4. **Configure build settings:**
   - Build command: `echo 'No build needed'` (or leave empty)
   - Publish directory: `public`
   - Functions directory: `netlify/functions`

5. **Click "Deploy site"**

6. **Done!** Your site will auto-deploy on every push to your repository

## Local Development

To test locally before deploying:

```bash
npm install
npm run dev
```

Open your browser to `http://localhost:8888`

The Netlify Dev server will:
- Serve your static files from `public/`
- Run your serverless functions locally
- Simulate the production environment

## Environment Variables

No environment variables are required for basic functionality. The app uses Netlify Blobs for storage, which works automatically in the Netlify environment.

If you want to set a custom site ID:
- Go to your Netlify site settings
- Site configuration > General > Site details
- Copy your Site ID
- Add as environment variable: `SITE_ID=your-site-id`

## Troubleshooting

### Functions not working locally?
- Make sure you're using `npm run dev` (Netlify Dev) not a regular static server
- Check that `@netlify/blobs` is installed: `npm install`

### Pins not persisting?
- Netlify Blobs requires your site to be deployed on Netlify
- In local development, pins may not persist between restarts

### CORS errors?
- The functions include CORS headers
- If issues persist, check your Netlify site settings

## Customization

### Change default map location
Edit `public/app.js` line 2:
```javascript
const map = L.map('map').setView([YOUR_LAT, YOUR_LNG], ZOOM_LEVEL);
```

### Change map style
Edit `public/app.js` lines 5-8 to use different tile providers:
- [Leaflet Provider Demo](https://leaflet-extras.github.io/leaflet-providers/preview/)

### Limit number of pins
Edit `netlify/functions/pins.js` line 76 to change the max pins (currently 1000)

## What's Next?

Some ideas to enhance your app:
- Add user authentication
- Allow pin editing/deletion
- Add categories or tags for pins
- Filter pins by date or user
- Add images to pins
- Real-time updates with WebSockets
- Export pins as GeoJSON

Enjoy your map pin app! 📍

