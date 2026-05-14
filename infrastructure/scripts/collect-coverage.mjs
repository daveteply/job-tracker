import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const coverageDir = 'coverage';
let summaryFiles = [];
try {
  summaryFiles = execSync(`find ${coverageDir} -name "coverage-summary.json"`)
    .toString()
    .split('\n')
    .filter(Boolean);
} catch (e) {
  // coverage dir might not exist
}

let markdown = '### 📊 CI Status\n\n- ✅ Lint, Build, and Tests passed.\n';

if (summaryFiles.length === 0) {
  markdown += '- ℹ️ No code coverage reports generated (no tests were affected or run).\n';
} else {
  markdown += '- 📈 Code coverage reports summary:\n\n';
  markdown += '| Project | Statements | Branches | Functions | Lines |\n';
  markdown += '| :--- | :--- | :--- | :--- | :--- |\n';

  summaryFiles.sort().forEach((file) => {
    try {
      const content = JSON.parse(fs.readFileSync(file, 'utf8'));
      const projectName = path.relative(coverageDir, path.dirname(file));
      const total = content.total;

      if (total) {
        markdown += `| **${projectName}** | ${total.statements.pct}% | ${total.branches.pct}% | ${total.functions.pct}% | ${total.lines.pct}% |\n`;
      }
    } catch (e) {
      console.error(`Error parsing ${file}:`, e);
    }
  });
}

fs.writeFileSync('coverage-summary.md', markdown);
console.log('Coverage summary generated in coverage-summary.md');
