#!/usr/bin/env node

/**
 * ProvenanceCode: Create a new decision record
 * Usage: node tools/new-decision.js <decision-name>
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DECISIONS_DIR = 'provenance/decisions';
const TEMPLATE_DIR = path.join(DECISIONS_DIR, 'TEMPLATE');

// Colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function printUsage() {
  console.log('Usage: node tools/new-decision.js <decision-name>');
  console.log('');
  console.log('Creates a new decision record from the template.');
  console.log('');
  console.log('Examples:');
  console.log('  node tools/new-decision.js use-postgresql');
  console.log('  node tools/new-decision.js jwt-authentication');
  console.log('  node tools/new-decision.js migrate-to-microservices');
  console.log('');
  console.log('Options:');
  console.log('  -h, --help     Show this help message');
  console.log('  -l, --list     List existing decisions');
}

function listDecisions() {
  console.log(colorize('📋 Existing Decisions:', 'blue'));
  console.log('');
  
  if (!fs.existsSync(DECISIONS_DIR)) {
    console.log(colorize('No decisions directory found', 'yellow'));
    return;
  }
  
  const dirs = fs.readdirSync(DECISIONS_DIR, { withFileTypes: true });
  
  for (const dir of dirs) {
    if (dir.isDirectory() && dir.name !== 'TEMPLATE') {
      const decisionJsonPath = path.join(DECISIONS_DIR, dir.name, 'decision.json');
      
      if (fs.existsSync(decisionJsonPath)) {
        try {
          const data = JSON.parse(fs.readFileSync(decisionJsonPath, 'utf8'));
          const statusIcons = {
            accepted: '✅',
            implemented: '🚀',
            proposed: '💭',
            deprecated: '⚠️',
            rejected: '❌',
          };
          
          const icon = statusIcons[data.status] || '❓';
          console.log(
            `${icon}  ${colorize(dir.name, 'green')} - ${data.title} (${colorize(
              data.status,
              'yellow'
            )})`
          );
        } catch (e) {
          console.log(`   ${colorize(dir.name, 'green')}`);
        }
      } else {
        console.log(`   ${colorize(dir.name, 'green')}`);
      }
    }
  }
}

function getNextNumber() {
  let maxNum = 0;
  
  if (!fs.existsSync(DECISIONS_DIR)) {
    return '001';
  }
  
  const dirs = fs.readdirSync(DECISIONS_DIR, { withFileTypes: true });
  
  for (const dir of dirs) {
    if (dir.isDirectory()) {
      const match = dir.name.match(/^(\d+)-/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) {
          maxNum = num;
        }
      }
    }
  }
  
  const nextNum = maxNum + 1;
  return nextNum.toString().padStart(3, '0');
}

function sanitizeName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function titleCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function updateFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  for (const [search, replace] of Object.entries(replacements)) {
    content = content.replace(new RegExp(search, 'g'), replace);
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

function createDecision(decisionName) {
  // Sanitize the decision name
  decisionName = sanitizeName(decisionName);
  
  if (!decisionName) {
    console.error(colorize('❌ Invalid decision name', 'red'));
    process.exit(1);
  }
  
  // Get next decision number
  const decisionNumber = getNextNumber();
  const fullName = `${decisionNumber}-${decisionName}`;
  const decisionPath = path.join(DECISIONS_DIR, fullName);
  
  // Check if decision already exists
  if (fs.existsSync(decisionPath)) {
    console.error(colorize(`❌ Decision already exists: ${fullName}`, 'red'));
    process.exit(1);
  }
  
  // Check if template exists
  if (!fs.existsSync(TEMPLATE_DIR)) {
    console.error(colorize(`❌ Template directory not found: ${TEMPLATE_DIR}`, 'red'));
    process.exit(1);
  }
  
  console.log(colorize(`📝 Creating new decision: ${fullName}`, 'blue'));
  console.log('');
  
  // Copy template
  copyDirectory(TEMPLATE_DIR, decisionPath);
  console.log(colorize('✅ Copied template', 'green'));
  
  // Get current date and time
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentDateTime = now.toISOString();
  
  // Update decision.json
  const decisionJsonPath = path.join(decisionPath, 'decision.json');
  if (fs.existsSync(decisionJsonPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(decisionJsonPath, 'utf8'));
      
      data.id = fullName;
      data.title = titleCase(decisionName);
      data.date = currentDate;
      data.lastUpdated = currentDate;
      data.provenanceCode.created = currentDateTime;
      data.provenanceCode.modified = currentDateTime;
      
      fs.writeFileSync(decisionJsonPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      console.log(colorize('✅ Updated decision.json', 'green'));
    } catch (e) {
      console.warn(colorize('⚠️  Could not update decision.json', 'yellow'));
    }
  }
  
  // Update prov.jsonld
  const provJsonldPath = path.join(decisionPath, 'prov.jsonld');
  updateFile(provJsonldPath, {
    'decision:template-example-decision': `decision:${fullName}`,
    '2026-02-06T10:00:00Z': currentDateTime,
  });
  console.log(colorize('✅ Updated prov.jsonld', 'green'));
  
  // Update c2pa.manifest.json
  const c2paManifestPath = path.join(decisionPath, 'c2pa.manifest.json');
  updateFile(c2paManifestPath, {
    'template-example-decision': fullName,
    '2026-02-06T10:00:00Z': currentDateTime,
    '2026-02-06': currentDate,
  });
  console.log(colorize('✅ Updated c2pa.manifest.json', 'green'));
  
  // Update decision.md
  const decisionMdPath = path.join(decisionPath, 'decision.md');
  updateFile(decisionMdPath, {
    'YYYY-MM-DD': currentDate,
  });
  console.log(colorize('✅ Updated decision.md', 'green'));
  
  console.log('');
  console.log(colorize('✨ Decision record created successfully!', 'green'));
  console.log('');
  console.log(colorize('📁 Location:', 'blue'), decisionPath);
  console.log('');
  console.log(colorize('Next steps:', 'blue'));
  console.log('  1. Edit the decision files:');
  console.log('     - decision.md (human-readable)');
  console.log('     - decision.json (machine-readable)');
  console.log('  2. Fill in all sections (context, decision, consequences, etc.)');
  console.log('  3. Add evidence to the evidence/ directory if available');
  console.log('  4. Validate your decision: node tools/validate-decision.js', fullName);
  console.log('  5. Commit to git: git add', decisionPath);
  console.log('');
  console.log(colorize('Resources:', 'blue'));
  console.log('  - Decision writing guide: docs/decision-records.md');
  console.log('  - Quick start: docs/quickstart.md');
  console.log('');
}

// Main
function main() {
  const args = process.argv.slice(2);
  
  // Check for help flag
  if (args.length === 0 || args[0] === '-h' || args[0] === '--help') {
    printUsage();
    process.exit(args.length === 0 ? 1 : 0);
  }
  
  // Check for list flag
  if (args[0] === '-l' || args[0] === '--list') {
    listDecisions();
    process.exit(0);
  }
  
  // Create decision
  createDecision(args[0]);
}

main();

