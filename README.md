# 🎬 Ishrealm - Anime Streaming Platform

A modern, cinematic anime streaming platform built with React, TypeScript, and Vite. Features a full-screen video player, real-time streaming from Bunny CDN, and a beautiful dark theme with pink accents.

## 🚀 Live Demo

- **Frontend**: [Vercel Deployment](https://ishanime.vercel.app)
- **Backend**: [Railway Deployment](https://ishanime-backend.railway.app)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Development Journey](#-development-journey)
- [Project Structure](#-project-structure)
- [Setup & Installation](#-setup--installation)
- [Deployment](#-deployment)
- [API Endpoints](#-api-endpoints)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🎥 Video Player
- **Full-screen cinematic experience** (100vh x 100vw)
- **Bunny CDN integration** for high-quality streaming
- **Ishrealm branding** throughout the player
- **Watermark logo** always visible during playback
- **Loading states** with Ishrealm logo and branding
- **Fallback states** for offline/demo mode

### 🎨 UI/UX
- **Dark theme** with pink gradient accents (#ff2e97 to #ff6ba9)
- **Responsive design** for all screen sizes
- **Smooth animations** with Framer Motion
- **Modern glassmorphism** effects
- **Professional typography** and spacing

### 📱 Navigation
- **Clean header** with Ishrealm logo
- **Search functionality** for shows and episodes
- **Episode selection** with thumbnails
- **Back navigation** to home page
- **Mobile-responsive** navigation

### 🔧 Technical Features
- **TypeScript** for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Auto-deployment** scripts for Vercel and Railway
- **Environment configuration** for different stages
- **Error handling** and loading states

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Bunny CDN API** - Video streaming
- **CORS** - Cross-origin resource sharing

### Deployment
- **Vercel** - Frontend hosting
- **Railway** - Backend hosting
- **GitHub** - Version control
- **Auto-deployment** scripts

## 🏗 Development Journey

### Phase 1: Initial Setup & Foundation
**Timeline**: Project Start

- ✅ **Project initialization** with Vite + React + TypeScript
- ✅ **Basic component structure** (Header, Hero, Carousel)
- ✅ **Dark theme implementation** with pink accents
- ✅ **Responsive layout** foundation
- ✅ **Mock data integration** for development

### Phase 2: Video Player Development
**Timeline**: Core Feature Development

- ✅ **VideoPlayer component** creation
- ✅ **Bunny CDN integration** for streaming
- ✅ **Iframe implementation** for video playback
- ✅ **Loading states** and error handling
- ✅ **Episode selection** functionality

### Phase 3: UI/UX Enhancement
**Timeline**: Design & User Experience

- ✅ **AnimeDetailPage** with show information
- ✅ **Episode carousel** with thumbnails
- ✅ **Search functionality** implementation
- ✅ **Navigation improvements** and back buttons
- ✅ **Mobile responsiveness** optimization

### Phase 4: Branding & Rebranding
**Timeline**: Brand Identity

- ✅ **Initial "Ishanime" branding** throughout the app
- ✅ **Logo integration** in header and video player
- ✅ **Complete rebranding** to "Ishrealm"
- ✅ **Logo visibility fixes** and watermark implementation
- ✅ **Consistent branding** across all components

### Phase 5: Video Player Optimization
**Timeline**: Cinematic Experience

- ✅ **Player size optimization** (85vh → 100vh)
- ✅ **Full-screen implementation** (100vw x 100vh)
- ✅ **Container restriction removal** (padding, margins)
- ✅ **Cinematic aspect ratio** implementation
- ✅ **Background logo integration** in player

### Phase 6: Deployment & Automation
**Timeline**: Production Ready

- ✅ **Vercel deployment** configuration
- ✅ **Railway backend** setup
- ✅ **Auto-deployment scripts** creation
- ✅ **Environment variable** management
- ✅ **CORS configuration** for production

### Phase 7: Bug Fixes & Polish
**Timeline**: Final Refinements

- ✅ **Build error fixes** (VideoPlayer.tsx corruption)
- ✅ **Logo path corrections** (/assets/ishanime-logo.png)
- ✅ **Episode ordering** (Episode 01 first)
- ✅ **Navigation button removal** (non-working arrows)
- ✅ **Thumbnail integration** for episodes

## 📁 Project Structure

```
ishanime/
├── public/
│   └── assets/
│       └── ishanime-logo.png          # Ishrealm logo
├── src/
│   ├── components/
│   │   ├── AnimeCard.tsx              # Anime card component
│   │   ├── AnimeCarousel.tsx          # Episode carousel
│   │   ├── AnimeDetailPage.tsx        # Main detail page
│   │   ├── BackendStatus.tsx          # API status indicator
│   │   ├── DemoModeIndicator.tsx      # Demo mode banner
│   │   ├── Header.tsx                 # Navigation header
│   │   ├── HeroSection.tsx            # Hero banner
│   │   ├── SearchBar.tsx              # Search functionality
│   │   └── VideoPlayer.tsx            # Main video player
│   ├── config.ts                      # API configuration
│   ├── globals.css                    # Global styles
│   └── main.tsx                       # App entry point
├── server/
│   ├── index.js                       # Backend server
│   └── package.json                   # Backend dependencies
├── scripts/
│   ├── deploy-full.js                 # Full deployment script
│   ├── deploy-railway.js              # Backend deployment
│   ├── deploy-vercel.js               # Frontend deployment
│   └── setup-deployment.js            # Initial setup
├── package.json                       # Frontend dependencies
├── vercel.json                        # Vercel configuration
├── railway.json                       # Railway configuration
└── README.md                          # This file
```

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/ishmaelishrealm/Ishanime.git
cd Ishanime

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Setup
```bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install

# Start backend server
npm start

# Development mode with auto-reload
npm run dev
```

### Environment Variables
Create `.env` files in both root and server directories:

**Frontend (.env)**
```env
VITE_API_URL=https://your-backend-url.railway.app
```

**Backend (server/.env)**
```env
BUNNY_LIBRARY_ID=your_bunny_library_id
BUNNY_API_KEY=your_bunny_api_key
BUNNY_DELIVERY_DOMAIN=your_delivery_domain
PORT=3000
NODE_ENV=production
```

## 🚀 Deployment

### Automated Deployment
```bash
# Full deployment (frontend + backend)
npm run deploy:full

# Frontend only (Vercel)
npm run deploy:frontend

# Backend only (Railway)
npm run deploy:backend
```

### Manual Deployment

**Frontend (Vercel)**
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to master

**Backend (Railway)**
1. Connect GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to master

## 🔌 API Endpoints

### Shows
- `GET /api/shows` - Get all available shows
- `GET /api/shows/:slug` - Get specific show with episodes

### Episodes
- `GET /api/episodes/:id` - Get episode details and streaming URLs

### Health Check
- `GET /api/health` - Backend status check

## 🎯 Key Features Explained

### Cinematic Video Player
The video player is designed for maximum immersion:
- **Full viewport dimensions** (100vw x 100vh)
- **No container restrictions** (removed padding/margins)
- **Ishrealm branding** with watermark logo
- **Background logo** during loading states
- **Smooth transitions** and hover effects

### Episode Management
- **Automatic sorting** (Episode 01 first)
- **Thumbnail integration** from Bunny CDN
- **Real-time streaming** URLs
- **Episode selection** with visual feedback

### Responsive Design
- **Mobile-first** approach
- **Flexible grid layouts**
- **Touch-friendly** navigation
- **Optimized typography** for all screens

## 🐛 Known Issues & Solutions

### Logo Visibility
**Issue**: Logo not showing in header
**Solution**: Fixed path to `/assets/ishanime-logo.png` and removed SVG fallback

### Video Player Size
**Issue**: Player not taking full screen
**Solution**: Removed all container restrictions and set to 100vw x 100vh

### Build Errors
**Issue**: VideoPlayer.tsx corruption with null characters
**Solution**: Recreated file with clean content

### Episode Ordering
**Issue**: Episodes not in numerical order
**Solution**: Added sorting logic to ensure Episode 01 comes first

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Bunny CDN** for video streaming infrastructure
- **Vercel** for frontend hosting
- **Railway** for backend hosting
- **React** and **TypeScript** communities
- **Tailwind CSS** for styling framework

## 📞 Support

For support, email support@ishrealm.com or create an issue in the GitHub repository.

---

**Built with ❤️ by the Ishrealm team**

*Last updated: January 2025*