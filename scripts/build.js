const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Files to copy into public
const filesToCopy = [
  'index.html',
  'style.css',
  'script.js',
  'sw.js',
  'manifest.json'
];

filesToCopy.forEach((file) => {
  const src = path.join(rootDir, file);
  const dest = path.join(publicDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
});

// Copy icons folder into public/icons
const iconsSrc = path.join(rootDir, 'icons');
const iconsDest = path.join(publicDir, 'icons');
if (fs.existsSync(iconsSrc)) {
  if (!fs.existsSync(iconsDest)) {
    fs.mkdirSync(iconsDest, { recursive: true });
  }
  const iconFiles = fs.readdirSync(iconsSrc);
  iconFiles.forEach((iconFile) => {
    fs.copyFileSync(path.join(iconsSrc, iconFile), path.join(iconsDest, iconFile));
  });
}

console.log('Successfully prepared public directory for Vercel deployment!');
