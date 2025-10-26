const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Aurora Rise Desktop build process...\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Please run this script from the project root directory');
  process.exit(1);
}

// Create build directory
const buildDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

try {
  console.log('📦 Installing dependencies...\n');
  
  // Install backend dependencies
  console.log('Installing backend dependencies...');
  execSync('npm install', { cwd: path.join(__dirname, '..', 'backend'), stdio: 'inherit' });
  
  // Install frontend dependencies
  console.log('Installing frontend dependencies...');
  execSync('npm install', { cwd: path.join(__dirname, '..', 'client'), stdio: 'inherit' });
  
  // Install electron dependencies
  console.log('Installing electron dependencies...');
  execSync('npm install', { cwd: path.join(__dirname, '..', 'electron'), stdio: 'inherit' });
  
  console.log('\n🔨 Building applications...\n');
  
  // Build backend
  console.log('Building backend...');
  execSync('npm run build', { cwd: path.join(__dirname, '..', 'backend'), stdio: 'inherit' });
  
  // Build frontend
  console.log('Building frontend...');
  execSync('npm run build', { cwd: path.join(__dirname, '..', 'client'), stdio: 'inherit' });
  
  console.log('\n✅ Build completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. cd electron');
  console.log('2. npm run build-win');
  console.log('3. Find your installer in electron/dist/');
  console.log('4. Installer will be automatically copied to client/public/downloads/');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
