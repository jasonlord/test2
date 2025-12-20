# Map Pin App 📍

A collaborative web app where users can drop pins on a map for others to find!

## Features

- 🗺️ Interactive map powered by Leaflet.js
- 📍 Click anywhere to drop a pin
- 💬 Add custom messages to your pins
- 👀 See pins dropped by other users in real-time
- 🎨 Beautiful, modern UI
- ☁️ Deployed on Netlify with serverless functions

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Netlify account

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run locally:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:8888`

### Deployment

1. Install Netlify CLI if you haven't:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize your site:
   ```bash
   netlify init
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

## How It Works

- **Frontend**: Static HTML/CSS/JavaScript with Leaflet.js for map rendering
- **Backend**: Netlify Functions (serverless) handle API requests
- **Storage**: Netlify Blobs stores pin data persistently
- **Deployment**: Automatically deployed via Netlify

## Usage

1. Open the app in your browser
2. Click anywhere on the map to drop a pin
3. Enter a message for your pin (optional)
4. Your pin will be saved and visible to all users
5. Click on any pin to see its message

## License

MIT

