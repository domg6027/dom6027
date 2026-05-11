// updateName.js
// Run with: node updateName.js
// Updates "Derech Olam Ministries" → "Derech Olam Mishkan International" in main HTML files

const fs = require('fs');
const path = require('path');

// Path to the main folder (Codespace root)
const mainFolder = './'; // adjust if needed

// Files to skip
const skipFiles = ['header.html', 'footer.html', 'nav.html'];

// Read all files in main folder
fs.readdir(mainFolder, (err, files) => {
  if (err) {
    console.error('Error reading folder:', err);
    return;
  }

  files.forEach(file => {
    const filePath = path.join(mainFolder, file);
    const ext = path.extname(file);

    // Skip non-HTML files and excluded files
    if (ext === '.html' && !skipFiles.includes(file)) {
      // Read file
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading file:', file, err);
          return;
        }

        // Replace text
        const result = data.replace(/Derech Olam Ministries/g, 'Derech Olam Mishkan International');

        // Write updated file
        fs.writeFile(filePath, result, 'utf8', (err) => {
          if (err) {
            console.error('Error writing file:', file, err);
          } else {
            console.log(`Updated ${file}`);
          }
        });
      });
    }
  });
});
