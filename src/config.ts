// API Configuration
// Update this URL to match your backend server

// Default for local development
export const API_URL = import.meta.env.VITE_API_URL || 'https://ishanime-backend-production.up.railway.app';

// Environment-based configuration
export const IS_PRODUCTION = import.meta.env.PROD;
export const IS_DEVELOPMENT = import.meta.env.DEV;

// Note: In Figma Make preview, the backend won't be available.
// Download the project to run the full stack locally.
