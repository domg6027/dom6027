#!/usr/bin/env node

/**
 * updateName.js
 * ------------------------
 * Replaces 'Derech Olam' with 'Mishkan International' in specified HTML files.
 * Logs updates, stages changes for git, and commits them.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// List of HTML files to update
const filesToUpdate = [
  'about.html',
  'archive2026.html',
  'finances.html',
  'index.html',
  'index2.html',
  'info.html',
  'new-direction.html',
  'prayer.html'
];

const OLD_TEXT = 'Derech Olam';
const NEW_TEXT = 'Mishkan International';

let updatedFiles = [];

// Function to update a file
function updateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes(OLD_TEXT)) {
    return;
  }

  const newContent = content.split(OLD_TEXT).join(NEW_TEXT);
  fs.writeFileSync(filePath, newContent, 'utf8');
  updatedFiles.push(filePath);
  console.log(`✅ Updated ${filePath}`);
}

// Update all files
filesToUpdate.forEach((file) => {
  const fullPath = path.resolve(__dirname, file);
  updateFile(fullPath);
});

if (updatedFiles.length === 0) {
  console.log('No files needed updating. Exiting.');
  process.exit(0);
}

// Git commit
try {
  execSync('git add .', { stdio: 'inherit' });

  execSync(
    'git commit -m "Updated Derech Olam name to Mishkan International"',
    { stdio: 'inherit' }
  );

  console.log('✅ Changes committed. Push handled by GitHub Actions workflow.');
} catch (err) {
  console.log('Nothing to commit. Exiting.');
  process.exit(0);
}
