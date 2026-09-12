const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname ? path.resolve(__dirname, '..') : process.cwd();
const webDir = path.join(rootDir, 'verschiedene webseit versionen', '04.09.2026');

console.log('[Build] Building Scratch n Travel Vite app in:', webDir);
try {
  execSync('npm run build', { cwd: webDir, stdio: 'inherit' });
} catch (e) {
  console.log('[Build] Note on build:', e.message);
}

const distDir = path.join(webDir, 'dist');
if (fs.existsSync(distDir)) {
  fs.cpSync(distDir, path.join(rootDir, 'dist'), { recursive: true });
  fs.copyFileSync(path.join(distDir, 'index.html'), path.join(rootDir, 'index.html'));
  if (fs.existsSync(path.join(distDir, 'assets'))) {
    fs.cpSync(path.join(distDir, 'assets'), path.join(rootDir, 'assets'), { recursive: true });
  }
  console.log('[Build] Successfully synchronized dist and root files for Scratch n Travel!');
}
