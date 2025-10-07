const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment for desktop build...\n');

// Environment configuration for desktop app
const desktopEnv = {
  NODE_ENV: 'production',
  PORT: '8000',
  MONGO_URI: 'mongodb+srv://wotbmadgamesexe:wotbmadgamesexe123@cluster0.tppwoc6.mongodb.net/',
  SESSION_SECRET: 'wotbmadgamesexe123',
  SESSION_EXPIRES_IN: '1d',
  GOOGLE_CLIENT_ID: '1072181846694-el2tmva90ht6vmlias91ddt0gbhgcngi.apps.googleusercontent.com',
  GOOGLE_CLIENT_SECRET: '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',
  GOOGLE_CALLBACK_URL: 'http://localhost:8000/api/auth/google/callback',
  FRONTEND_ORIGIN: 'http://localhost:8000',
  FRONTEND_GOOGLE_CALLBACK_URL: 'http://localhost:8000/google/callback',
  GEMINI_API_KEY: 'AIzaSyCdd2hsJ6YM0F1W-VS6ORmS-_l3qlK91XM',
  GEMINI_MODEL: 'gemini-2.0-flash',
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models',
  FRONTEND_URL: 'http://localhost:8000'
};

// Create .env file for backend
const backendEnvPath = path.join(__dirname, '..', 'backend', '.env');
const backendEnvContent = Object.entries(desktopEnv)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

fs.writeFileSync(backendEnvPath, backendEnvContent);
console.log('✅ Created backend/.env for desktop build');

// Create .env file for frontend
const frontendEnvPath = path.join(__dirname, '..', 'client', '.env');
const frontendEnvContent = `VITE_API_BASE_URL=http://localhost:8000/api
VITE_POLAR_CLIENT_ID=87d902b9-ACCH-4579-a636-a9e342ae090b
VITE_POLAR_CLIENT_SECRET=326c0ac7-332c-4a8a-8174-d47ad6538d2c
VITE_POLAR_AUTH_URL=https://flow.polar.com/oauth2/authorization
VITE_POLAR_TOKEN_URL=https://polarremote.com/v2/oauth2/token
VITE_POLAR_REDIRECT_URI=http://localhost:8000/auth/polar/callback
VITE_POLAR_API_BASE_URL=https://www.polaraccesslink.com/v3
VITE_POLAR_SCOPES=accesslink.read_all`;

fs.writeFileSync(frontendEnvPath, frontendEnvContent);
console.log('✅ Created client/.env for desktop build');

console.log('\n🎉 Environment setup completed!');
console.log('\n📋 Desktop app will run on: http://localhost:8000');

