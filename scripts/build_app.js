const fs = require('fs');
const path = require('path');

const rootDir = __dirname ? path.resolve(__dirname, '..') : process.cwd();
const distDir = path.join(rootDir, 'dist');

console.log('[Build] Scratch\'n\'Travel dist is pre-compiled and ready at:', distDir);
