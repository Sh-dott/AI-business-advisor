# Setup Instructions

This document guides you through installing and running the Business Tech Advisor application.

## Prerequisites

- **Node.js 14+** - Download from https://nodejs.org/
- **npm** - Comes with Node.js
- **Git** (optional) - For version control

## Installation

### 1. Install Dependencies

```bash
cd frontend
npm install
```

This will install React and all required packages.

### 2. Run Development Server

```bash
npm start
```

The application will open automatically at `http://localhost:3000`

### 3. Make Code Changes

Edit files in `src/` directory:
- `BusinessTechAdvisor.jsx` - Main component
- `src/data/technologies.js` - Add/edit technologies
- `src/data/questions.js` - Add/edit quiz questions
- `src/utils/analysis.js` - Modify scoring algorithm
- `src/index.css` - Change styling

Changes will hot-reload automatically!

## Building for Production

```bash
npm run build
```

This creates an optimized `build/` folder ready for deployment.

### Deploy to Different Platforms

**GitHub Pages:**
```bash
npm install --save-dev gh-pages
# Update package.json with "homepage": "https://yourusername.github.io/repo-name"
npm run build
npm run deploy
```

**Netlify:**
1. Push code to GitHub
2. Connect repository to Netlify
3. Set build command to: `npm run build`
4. Set publish directory to: `build`

**Vercel:**
```bash
npm install -g vercel
vercel
```

**AWS S3 + CloudFront:**
```bash
npm run build
# Upload build/ folder to S3 bucket
```

## Project Structure

```
frontend/
├── src/
│   ├── BusinessTechAdvisor.jsx   # Main component
│   ├── App.js                    # React app wrapper
│   ├── index.js                  # Entry point
│   ├── index.css                 # Styling
│   ├── data/
│   │   ├── technologies.js       # Technology database
│   │   └── questions.js          # Quiz questions
│   └── utils/
│       └── analysis.js           # Recommendation algorithm
├── public/
│   ├── index.html                # HTML template
│   └── manifest.json             # PWA manifest
└── package.json                  # Dependencies

backend/
└── README.md                      # Backend documentation (future)

docs/
├── SETUP.md                       # This file
├── ARCHITECTURE.md               # System design
└── API.md                        # API documentation
```

## Troubleshooting

### "npm: command not found"
- Make sure Node.js is installed: `node --version`
- Restart terminal after installing Node.js

### Port 3000 already in use
```bash
# Use different port
PORT=3001 npm start
```

### Module not found errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Styling not loading
```bash
# Clear browser cache
# In Chrome: Ctrl+Shift+Delete and clear cached images/files
# Then refresh the page
```

## Next Steps

1. **Customize Technologies** - Edit `src/data/technologies.js` with your own tools
2. **Update Questions** - Modify `src/data/questions.js` to fit your business
3. **Adjust Scoring** - Fine-tune the algorithm in `src/utils/analysis.js`
4. **Change Colors** - Update CSS variables in `src/index.css` `:root` section
5. **Add Backend** - Implement API endpoints in `backend/` directory

## Support

For issues:
1. Check console errors: `F12` → Console tab
2. Review source code comments
3. Check documentation in `docs/` folder
4. Search for similar issues on Stack Overflow
