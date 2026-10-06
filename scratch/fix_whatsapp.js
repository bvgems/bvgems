const fs = require('fs');

function replaceInFile(file, oldStr, newStr) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(oldStr, newStr);
  fs.writeFileSync(file, content);
}

replaceInFile(
  'src/components/CommonComponents/QuoteRequestModal.tsx',
  'window.open(`https://wa.me/12129444382?text=${encodeURIComponent(text)}`, "_blank");',
  'window.location.href = `https://wa.me/12129444382?text=${encodeURIComponent(text)}`;'
);

replaceInFile(
  'src/components/Category/CategoryTable.tsx',
  'window.open(`https://wa.me/12129444382?text=${encodeURIComponent(text)}`, "_blank");',
  'window.location.href = `https://wa.me/12129444382?text=${encodeURIComponent(text)}`;'
);

replaceInFile(
  'src/components/CommonComponents/WhatsAppButton.tsx',
  'target="_blank"',
  'target="_self"'
);

console.log("Done");
