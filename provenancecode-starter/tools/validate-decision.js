#!/usr/bin/env node

/**
 * ProvenanceCode: Validate decision records
 * Usage: node tools/validate-decision.js [decision-id] [--all]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DECISIONS_DIR = 'provenance/decisions';
const SCHEMA_PATH = 'provenance/schemas/decision.schema.json';

// Colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  dim: '\x1b[2m',
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function printUsage() {
  console.log('Usage: node tools/validate-decision.js [decision-id] [options]');
  console.log('');
  console.log('Validates decision records against the schema and best practices.');
  console.log('');
  console.log('Examples:');
  console.log('  node tools/validate-decision.js 001-use-postgresql');
  console.log('  node tools/validate-decision.js --all');
  console.log('  node tools/validate-decision.js 002-jwt-auth --verbose');
  console.log('');
  console.log('Options:');
  console.log('  --all          Validate all decisions');
  console.log('  --verbose, -v  Show detailed output');
  console.log('  --help, -h     Show this help message');
}

// Simple JSON schema validator
function validateSchema(data, schema) {
  const errors = [];
  
  // Check required fields
  if (schema.required) {
    for (const field of schema.required) {
      if (!(field in data)) {
        errors.push(`Missing required field: ${field}`);
      }
    }
  }
  
  // Check properties
  if (schema.properties) {
    for (const [key, propSchema] of Object.entries(schema.properties)) {
      if (key in data) {
        const value = data[key];
        
        // Type check
        if (propSchema.type) {
          const types = Array.isArray(propSchema.type) ? propSchema.type : [propSchema.type];
          const actualType = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;
          
          if (!types.includes(actualType)) {
            errors.push(`Field ${key}: expected type ${types.join(' or ')}, got ${actualType}`);
          }
        }
        
        // Enum check
        if (propSchema.enum && !propSchema.enum.includes(value)) {
          errors.push(`Field ${key}: must be one of ${propSchema.enum.join(', ')}`);
        }
        
        // String checks
        if (propSchema.type === 'string' && typeof value === 'string') {
          if (propSchema.minLength && value.length < propSchema.minLength) {
            errors.push(`Field ${key}: minimum length is ${propSchema.minLength}`);
          }
          if (propSchema.maxLength && value.length > propSchema.maxLength) {
            errors.push(`Field ${key}: maximum length is ${propSchema.maxLength}`);
          }
          if (propSchema.pattern) {
            const regex = new RegExp(propSchema.pattern);
            if (!regex.test(value)) {
              errors.push(`Field ${key}: does not match pattern ${propSchema.pattern}`);
            }
          }
        }
        
        // Array checks
        if (propSchema.type === 'array' && Array.isArray(value)) {
          if (propSchema.minItems && value.length < propSchema.minItems) {
            errors.push(`Field ${key}: minimum ${propSchema.minItems} items required`);
          }
        }
        
        // Object checks (recursive)
        if (propSchema.type === 'object' && typeof value === 'object' && value !== null) {
          const nestedErrors = validateSchema(value, propSchema);
          errors.push(...nestedErrors.map(e => `${key}.${e}`));
        }
      }
    }
  }
  
  return errors;
}

function validateDecisionRecord(decisionPath, verbose = false) {
  const decisionName = path.basename(decisionPath);
  const results = {
    name: decisionName,
    valid: true,
    errors: [],
    warnings: [],
    info: [],
  };
  
  console.log(colorize(`\n📋 Validating: ${decisionName}`, 'blue'));
  
  // Check required files
  const requiredFiles = ['decision.md', 'decision.json'];
  const optionalFiles = ['prov.jsonld', 'c2pa.manifest.json'];
  
  for (const file of requiredFiles) {
    const filePath = path.join(decisionPath, file);
    if (!fs.existsSync(filePath)) {
      results.errors.push(`Missing required file: ${file}`);
      results.valid = false;
    } else if (verbose) {
      results.info.push(`Found required file: ${file}`);
    }
  }
  
  for (const file of optionalFiles) {
    const filePath = path.join(decisionPath, file);
    if (!fs.existsSync(filePath)) {
      results.warnings.push(`Missing optional file: ${file}`);
    } else if (verbose) {
      results.info.push(`Found optional file: ${file}`);
    }
  }
  
  // Validate decision.json
  const decisionJsonPath = path.join(decisionPath, 'decision.json');
  if (fs.existsSync(decisionJsonPath)) {
    try {
      const decisionData = JSON.parse(fs.readFileSync(decisionJsonPath, 'utf8'));
      
      // Load schema if available
      if (fs.existsSync(SCHEMA_PATH)) {
        const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
        const schemaErrors = validateSchema(decisionData, schema);
        
        if (schemaErrors.length > 0) {
          results.errors.push(...schemaErrors);
          results.valid = false;
        } else if (verbose) {
          results.info.push('Schema validation passed');
        }
      } else {
        results.warnings.push('Schema file not found, skipping schema validation');
      }
      
      // Check for common issues
      if (!decisionData.title || decisionData.title.length < 5) {
        results.errors.push('Title is missing or too short');
        results.valid = false;
      }
      
      if (!decisionData.status) {
        results.errors.push('Status is missing');
        results.valid = false;
      }
      
      if (!decisionData.date) {
        results.errors.push('Date is missing');
        results.valid = false;
      }
      
      // Check context
      if (!decisionData.context || !decisionData.context.problem) {
        results.warnings.push('Context or problem description is missing');
      } else if (decisionData.context.problem.length < 50) {
        results.warnings.push('Problem description is very short (< 50 characters)');
      }
      
      // Check decision
      if (!decisionData.decision || !decisionData.decision.summary) {
        results.warnings.push('Decision summary is missing');
      }
      
      // Check consequences
      if (!decisionData.consequences) {
        results.errors.push('Consequences section is missing');
        results.valid = false;
      } else {
        if (!decisionData.consequences.positive || decisionData.consequences.positive.length === 0) {
          results.warnings.push('No positive consequences listed');
        }
        
        if (!decisionData.consequences.negative || decisionData.consequences.negative.length === 0) {
          results.warnings.push('No negative consequences listed (be honest about trade-offs!)');
        }
      }
      
      // Check for alternatives
      if (!decisionData.alternatives || decisionData.alternatives.length === 0) {
        results.warnings.push('No alternatives considered (recommended to document)');
      }
      
      // Check for evidence
      if (!decisionData.evidence) {
        results.warnings.push('No evidence provided (recommended for important decisions)');
      }
      
    } catch (e) {
      results.errors.push(`Invalid JSON in decision.json: ${e.message}`);
      results.valid = false;
    }
  }
  
  // Validate prov.jsonld
  const provJsonldPath = path.join(decisionPath, 'prov.jsonld');
  if (fs.existsSync(provJsonldPath)) {
    try {
      const provData = JSON.parse(fs.readFileSync(provJsonldPath, 'utf8'));
      
      if (!provData['@context']) {
        results.warnings.push('prov.jsonld missing @context');
      }
      
      if (verbose) {
        results.info.push('prov.jsonld is valid JSON-LD');
      }
    } catch (e) {
      results.errors.push(`Invalid JSON in prov.jsonld: ${e.message}`);
      results.valid = false;
    }
  }
  
  // Validate c2pa.manifest.json
  const c2paManifestPath = path.join(decisionPath, 'c2pa.manifest.json');
  if (fs.existsSync(c2paManifestPath)) {
    try {
      JSON.parse(fs.readFileSync(c2paManifestPath, 'utf8'));
      if (verbose) {
        results.info.push('c2pa.manifest.json is valid JSON');
      }
    } catch (e) {
      results.errors.push(`Invalid JSON in c2pa.manifest.json: ${e.message}`);
      results.valid = false;
    }
  }
  
  // Print results
  if (results.errors.length > 0) {
    console.log(colorize('  ❌ Errors:', 'red'));
    results.errors.forEach(err => console.log(colorize(`     - ${err}`, 'red')));
  }
  
  if (results.warnings.length > 0) {
    console.log(colorize('  ⚠️  Warnings:', 'yellow'));
    results.warnings.forEach(warn => console.log(colorize(`     - ${warn}`, 'yellow')));
  }
  
  if (verbose && results.info.length > 0) {
    console.log(colorize('  ℹ️  Info:', 'dim'));
    results.info.forEach(info => console.log(colorize(`     - ${info}`, 'dim')));
  }
  
  if (results.valid && results.warnings.length === 0) {
    console.log(colorize('  ✅ All checks passed!', 'green'));
  } else if (results.valid) {
    console.log(colorize('  ✅ Valid (with warnings)', 'green'));
  } else {
    console.log(colorize('  ❌ Validation failed', 'red'));
  }
  
  return results;
}

function validateAll(verbose = false) {
  console.log(colorize('🔍 Validating all decision records...', 'blue'));
  
  if (!fs.existsSync(DECISIONS_DIR)) {
    console.error(colorize(`❌ Decisions directory not found: ${DECISIONS_DIR}`, 'red'));
    process.exit(1);
  }
  
  const dirs = fs.readdirSync(DECISIONS_DIR, { withFileTypes: true });
  const results = [];
  
  for (const dir of dirs) {
    if (dir.isDirectory() && dir.name !== 'TEMPLATE') {
      const decisionPath = path.join(DECISIONS_DIR, dir.name);
      const result = validateDecisionRecord(decisionPath, verbose);
      results.push(result);
    }
  }
  
  // Summary
  console.log(colorize('\n📊 Summary:', 'blue'));
  const valid = results.filter(r => r.valid).length;
  const invalid = results.filter(r => !r.valid).length;
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
  
  console.log(`  Total decisions: ${results.length}`);
  console.log(colorize(`  ✅ Valid: ${valid}`, valid > 0 ? 'green' : 'dim'));
  console.log(colorize(`  ❌ Invalid: ${invalid}`, invalid > 0 ? 'red' : 'dim'));
  console.log(colorize(`  ⚠️  Warnings: ${totalWarnings}`, totalWarnings > 0 ? 'yellow' : 'dim'));
  
  if (invalid > 0) {
    console.log('\n' + colorize('❌ Some decisions failed validation', 'red'));
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log('\n' + colorize('✅ All decisions are valid (with warnings)', 'green'));
    process.exit(0);
  } else {
    console.log('\n' + colorize('✅ All decisions are valid!', 'green'));
    process.exit(0);
  }
}

function main() {
  const args = process.argv.slice(2);
  
  // Parse options
  const options = {
    all: args.includes('--all'),
    verbose: args.includes('--verbose') || args.includes('-v'),
    help: args.includes('--help') || args.includes('-h'),
  };
  
  const decisionId = args.find(arg => !arg.startsWith('--') && !arg.startsWith('-'));
  
  if (options.help || (args.length === 0 && !options.all)) {
    printUsage();
    process.exit(0);
  }
  
  if (options.all) {
    validateAll(options.verbose);
  } else if (decisionId) {
    const decisionPath = path.join(DECISIONS_DIR, decisionId);
    
    if (!fs.existsSync(decisionPath)) {
      console.error(colorize(`❌ Decision not found: ${decisionId}`, 'red'));
      process.exit(1);
    }
    
    const result = validateDecisionRecord(decisionPath, options.verbose);
    process.exit(result.valid ? 0 : 1);
  } else {
    printUsage();
    process.exit(1);
  }
}

main();

