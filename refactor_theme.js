const fs = require('fs');
const path = require('path');

const REPLACEMENTS = [
  { search: /\btext-white\b/g, replace: 'text-gray-900' },
  { search: /\btext-gray-400\b/g, replace: 'text-gray-600' },
  { search: /\btext-gray-300\b/g, replace: 'text-gray-700' },
  { search: /\bbg-white\/5\b/g, replace: 'bg-black/5' },
  { search: /\bbg-white\/10\b/g, replace: 'bg-black/10' },
  { search: /\bbg-black\/60\b/g, replace: 'bg-white/80' },
  { search: /\bh-screen\b/g, replace: 'min-h-screen' }, // Fix any layout issues just in case
];

// Revert specific occurrences where text-white MUST remain
const FIXUPS = [
  { search: /bg-\[var\(--color-primary\)\] text-gray-900/g, replace: 'bg-[var(--color-primary)] text-white' },
  { search: /bg-\[var\(--color-secondary\)\] text-gray-900/g, replace: 'bg-[var(--color-secondary)] text-white' },
  { search: /bg-red-500\/90 text-gray-900/g, replace: 'bg-red-500/90 text-white' },
  { search: /bg-green-500\/90 text-gray-900/g, replace: 'bg-green-500/90 text-white' },
  { search: /bg-blue-600 hover:bg-blue-700 text-gray-900/g, replace: 'bg-blue-600 hover:bg-blue-700 text-white' },
  { search: /bg-red-600 hover:bg-red-700 text-gray-900/g, replace: 'bg-red-600 hover:bg-red-700 text-white' },
  { search: /bg-gray-600 text-gray-900/g, replace: 'bg-gray-600 text-white' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let modified = content;
      for (const rule of REPLACEMENTS) {
        modified = modified.replace(rule.search, rule.replace);
      }
      
      for (const fix of FIXUPS) {
        modified = modified.replace(fix.search, fix.replace);
      }

      if (content !== modified) {
        fs.writeFileSync(fullPath, modified, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

console.log("Starting workspace theme refactor...");
processDirectory(path.join(__dirname, 'src'));
console.log("Refactoring complete.");
