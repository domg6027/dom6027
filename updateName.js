const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// --- Config ---
const mainFolder = './';
const skipFiles = ['header.html', 'footer.html', 'nav.html'];
const oldName = 'Derech Olam Ministries';
const newName = 'Derech Olam Mishkan International';

// --- Read & update files ---
let filesUpdated = 0;

fs.readdirSync(mainFolder).forEach(file => {
  const filePath = path.join(mainFolder, file);

  if (path.extname(file) === '.html' &&
      !skipFiles.includes(file) &&
      fs.lstatSync(filePath).isFile()) {

    let data = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Replace main text
    if (data.includes(oldName)) {
      data = data.replace(new RegExp(oldName, 'g'), newName);
      updated = true;
    }

    // <title>
    data = data.replace(/<title>(.*?)<\/title>/i, (match, p1) => {
      if (p1.includes(oldName)) {
        updated = true;
        return `<title>${p1.replace(oldName, newName)}</title>`;
      }
      return match;
    });

    // <meta name="description">
    data = data.replace(/<meta\s+name=["']description["']\s+content=["'](.*?)["']\s*\/?>/i, (match, p1) => {
      if (p1.includes(oldName)) {
        updated = true;
        return `<meta name="description" content="${p1.replace(oldName, newName)}">`;
      }
      return match;
    });

    // <meta name="author">
    data = data.replace(/<meta\s+name=["']author["']\s+content=["'](.*?)["']\s*\/?>/i, (match, p1) => {
      if (p1.includes(oldName)) {
        updated = true;
        return `<meta name="author" content="${p1.replace(oldName, newName)}">`;
      }
      return match;
    });

    if (updated) {
      fs.writeFileSync(filePath, data, 'utf8');
      console.log(`✅ Updated ${file}`);
      filesUpdated++;
    }
  }
});

if (filesUpdated === 0) {
  console.log("ℹ️ No files needed updating.");
}

// --- Git commit & push ---
try {
  const GITHUB_PAT = process.env.DOMG6027_UPDATE_TEMP;
  if (!GITHUB_PAT) throw new Error("DOMG6027_UPDATE_TEMP env variable not set");

  // Configure Git user
  execSync('git config --global user.name "GitHub Actions Bot"');
  execSync('git config --global user.email "actions@github.com"');

  // Stage changes
  execSync('git add .');

  // Check if there is anything to commit
  const status = execSync('git status --porcelain').toString().trim();
  if (!status) {
    console.log("ℹ️ Nothing to commit.");
    process.exit(0);
  }

  // Commit
  execSync('git commit -m "Updated Derech Olam name to Mishkan International across main HTML files"', { stdio: 'inherit' });

  // Set remote to use PAT
  const repo = process.env.GITHUB_REPOSITORY;
  execSync(`git remote set-url origin https://x-access-token:${GITHUB_PAT}@github.com/${repo}.git`);

  // Push
  execSync('git push origin HEAD:main', { stdio: 'inherit' });

  console.log("✅ Changes pushed successfully.");
} catch (err) {
  console.error("⚠️ Git push failed:", err.message);
  process.exit(1);
}
