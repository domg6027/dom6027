const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Main folder & skipped files
const mainFolder = './';
const skipFiles = ['header.html', 'footer.html', 'nav.html'];

// Replacement
const oldName = 'Derech Olam Ministries';
const newName = 'Derech Olam Mishkan International';

// Read all files in main folder
fs.readdirSync(mainFolder).forEach(file => {
  const filePath = path.join(mainFolder, file);

  if (
    path.extname(file) === '.html' &&
    !skipFiles.includes(file) &&
    fs.lstatSync(filePath).isFile()
  ) {
    let data = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Replace text
    if (data.includes(oldName)) {
      data = data.replace(new RegExp(oldName, 'g'), newName);
      updated = true;
    }

    // Update <title>
    data = data.replace(/<title>(.*?)<\/title>/i, (match, p1) => {
      if (p1.includes(oldName)) {
        updated = true;
        return `<title>${p1.replace(oldName, newName)}</title>`;
      }
      return match;
    });

    // Update <meta name="description">
    data = data.replace(/<meta\s+name=["']description["']\s+content=["'](.*?)["']\s*\/?>/i, (match, p1) => {
      if (p1.includes(oldName)) {
        updated = true;
        return `<meta name="description" content="${p1.replace(oldName, newName)}">`;
      }
      return match;
    });

    // Update <meta name="author">
    data = data.replace(/<meta\s+name=["']author["']\s+content=["'](.*?)["']\s*\/?>/i, (match, p1) => {
      if (p1.includes(oldName)) {
        updated = true;
        return `<meta name="author" content="${p1.replace(oldName, newName)}">`;
      }
      return match;
    });

    if (updated) {
      fs.writeFileSync(filePath, data, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
});

// --- Git commit & push ---
try {
  const GITHUB_PAT = process.env.GITHUB_PAT;
  if (!GITHUB_PAT) throw new Error("GITHUB_PAT environment variable not set");

  // Configure Git
  execSync('git config --global user.name "GitHub Actions Bot"');
  execSync('git config --global user.email "actions@github.com"');

  // Stage all changes
  execSync('git add .');

  // Commit
  execSync('git commit -m "Updated Derech Olam name to Mishkan International across main HTML files"', { stdio: 'inherit' });

  // Push using PAT
  const repo = process.env.GITHUB_REPOSITORY;
  execSync(`git push https://x-access-token:${GITHUB_PAT}@github.com/${repo} HEAD`, { stdio: 'inherit' });

  console.log("✅ Changes pushed successfully");
} catch (err) {
  console.error("⚠️ Git push failed or nothing to commit:", err.message);
}
