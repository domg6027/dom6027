const fs = require('fs');
const path = require('path');

// Main root folder
const mainFolder = './';
// Files to skip
const skipFiles = ['header.html', 'footer.html', 'nav.html'];

// Replacement text
const oldName = 'Derech Olam Ministries';
const newName = 'Derech Olam Mishkan International';

// Read all files in the main folder
fs.readdir(mainFolder, (err, files) => {
  if (err) throw err;

  files.forEach(file => {
    const filePath = path.join(mainFolder, file);

    // Only process HTML files in main folder, not skipped files
    if (
      path.extname(file) === '.html' &&
      !skipFiles.includes(file) &&
      fs.lstatSync(filePath).isFile()
    ) {
      let data = fs.readFileSync(filePath, 'utf8');
      let updated = false;

      // 1. Replace all text occurrences
      if (data.includes(oldName)) {
        data = data.replace(new RegExp(oldName, 'g'), newName);
        updated = true;
      }

      // 2. Update <title> tag if it contains oldName
      data = data.replace(/<title>(.*?)<\/title>/i, (match, p1) => {
        if (p1.includes(oldName)) {
          updated = true;
          return `<title>${p1.replace(oldName, newName)}</title>`;
        }
        return match;
      });

      // 3. Update <meta name="description"> if it contains oldName
      data = data.replace(/<meta\s+name=["']description["']\s+content=["'](.*?)["']\s*\/?>/i, (match, p1) => {
        if (p1.includes(oldName)) {
          updated = true;
          return `<meta name="description" content="${p1.replace(oldName, newName)}">`;
        }
        return match;
      });

      // 4. Update <meta name="author"> if it contains oldName
      data = data.replace(/<meta\s+name=["']author["']\s+content=["'](.*?)["']\s*\/?>/i, (match, p1) => {
        if (p1.includes(oldName)) {
          updated = true;
          return `<meta name="author" content="${p1.replace(oldName, newName)}">`;
        }
        return match;
      });

      // 5. Write back only if updates were made
      if (updated) {
        fs.writeFileSync(filePath, data, 'utf8');
        console.log(`Updated ${file}`);
      }
    }
  });
});
