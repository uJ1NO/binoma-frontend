// API Configuration for Production Deployment
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Backend URLs
const API_URLS = {
  development: 'http://localhost:8080/api/v1',
  production: 'https://binoma-backend.onrender.com/api/v1', // Update with your actual Render URL
};

export const API_BASE_URL = isDevelopment ? API_URLS.development : API_URLS.production;

// WebSocket URLs
const WS_URLS = {
  development: 'ws://localhost:8080/ws',
  production: 'wss://binoma-backend.onrender.com/ws', // Update with your actual Render URL
};

export const WS_BASE_URL = isDevelopment ? WS_URLS.development : WS_URLS.production;

// API Configuration
export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Export for use in services
export default {
  API_BASE_URL,
  WS_BASE_URL,
  API_CONFIG,
}; 