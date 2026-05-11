// updateName.js
// Updates "Derech Olam Ministries" → "Derech Olam Mishkan International"
// Only for HTML files in the main root folder
// Skips header.html, footer.html, nav.html

const fs = require('fs');
const path = require('path');

const mainFolder = './'; // main root folder
const skipFiles = ['header.html', 'footer.html', 'nav.html'];

// Read all files in the main folder
fs.readdir(mainFolder, (err, files) => {
  if (err) throw err;

  files.forEach(file => {
    const filePath = path.join(mainFolder, file);

    // Only process HTML files that are not skipped and are actual files
    if (
      path.extname(file) === '.html' &&
      !skipFiles.includes(file) &&
      fs.lstatSync(filePath).isFile()
    ) {
      // Read file content
      let data = fs.readFileSync(filePath, 'utf8');

      // Replace all occurrences
      data = data.replace(/Derech Olam Ministries/g, 'Derech Olam Mishkan International');

      // Write updated content back to file
      fs.writeFileSync(filePath, data, 'utf8');

      console.log(`Updated ${file}`);
    }
  });
});
