// vercel.build.js
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

// Ensure we're in the correct directory
process.chdir(__dirname);

// Create a .npmrc file to ensure proper installation
writeFileSync('.npmrc', `legacy-peer-deps=true\nstrict-peer-dependencies=false\n`);

// Install dependencies
console.log('Installing dependencies...');
execSync('npm install', { stdio: 'inherit' });

// Run the build
console.log('Building the application...');
execSync('npm run build', { stdio: 'inherit' }); 