# AI Rules and Integration Guide

How to configure AI coding assistants to work with ProvenanceCode decision records.

## Overview

AI coding assistants (Cursor, Copilot, Claude, etc.) can be powerful allies when they understand your architectural decisions. This guide shows you how to configure AI tools to:

1. **Read and respect** existing decision records
2. **Suggest changes** that align with established patterns
3. **Flag potential violations** of architectural decisions
4. **Help create** new decision records

## Benefits of AI Integration

### For Developers
- AI suggestions aligned with team decisions
- Automatic detection of pattern violations
- Faster onboarding (AI explains decisions)
- Decision-aware code reviews

### For Teams
- Consistent patterns across the codebase
- Reduced architectural drift
- Living documentation
- Better code review conversations

## Configuring AI Assistants

### Cursor IDE

Cursor reads rules from `.cursorrules` files in your project root.

**Setup:**

1. Copy the template:
```bash
cp rules/cursor-rules.md .cursorrules
```

2. Customize for your project:
```markdown
# ProvenanceCode Rules for Cursor

## Core Principles
Read and follow all decisions in `provenance/decisions/`.

## Before Suggesting Changes
1. Search for relevant decision records
2. Check if the suggestion aligns with established patterns
3. If unclear, ask the user to clarify against decisions

## When Creating Code
- Follow patterns from accepted decisions
- Reference decision IDs in comments
- Flag potential violations

## Decision Record Awareness
Current architectural decisions:
- #001: Use PostgreSQL for primary database
- #002: React + TypeScript for frontend
- #003: Microservices architecture with REST APIs

[Add your project-specific decisions here]
```

**Usage:**

```javascript
// Cursor will suggest code like this:
// Following decision #001 (Use PostgreSQL)
const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  // ...
});
```

**Advanced Configuration:**

```markdown
## Validation Rules
- All database access must use the connection pool (#001)
- All API routes must include authentication middleware (#004)
- No direct DOM manipulation in React components (#002)

## Path-Specific Rules
### src/api/
- Must follow REST conventions (#003)
- Must include OpenAPI documentation
- Must include rate limiting

### src/database/
- Must use migrations for schema changes (#001)
- No raw SQL in application code
- All queries must be parameterized
```

### GitHub Copilot

Copilot reads instructions from `.github/copilot-instructions.md`.

**Setup:**

1. Create the instructions file:
```bash
cp rules/copilot-instructions.md .github/copilot-instructions.md
```

2. Customize for your project:
```markdown
# GitHub Copilot Instructions

## Architectural Context
This project uses ProvenanceCode for decision tracking.

## Decision Records Location
All decisions are in `provenance/decisions/`. Read them before suggesting code.

## Key Decisions
1. **Database**: PostgreSQL with Prisma ORM (decision 001)
2. **API Style**: RESTful with OpenAPI specs (decision 003)
3. **Authentication**: JWT with refresh tokens (decision 004)

## Code Patterns
When suggesting database queries:
```typescript
// GOOD: Using Prisma (follows #001)
const user = await prisma.user.findUnique({ where: { id } });

// BAD: Raw SQL
const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
```

When suggesting API endpoints:
```typescript
// GOOD: RESTful pattern (follows #003)
router.get('/api/v1/users/:id', authenticateJWT, getUser);

// BAD: RPC-style
router.post('/api/getUser', { id: 123 });
```

## Always Include
- Decision references in significant code comments
- Error handling following established patterns
- Type safety (TypeScript)
```

**Testing Copilot:**

```javascript
// Type: "create a new user endpoint"
// Copilot should suggest something like:

/**
 * Create a new user
 * Follows REST conventions from decision #003
 */
router.post('/api/v1/users', 
  authenticateJWT,  // Required by decision #004
  validateRequest(createUserSchema),
  async (req, res) => {
    // Using Prisma per decision #001
    const user = await prisma.user.create({
      data: req.body
    });
    res.status(201).json(user);
  }
);
```

### Claude (via API or Code)

Claude can read decision context when you include it in prompts.

**Setup:**

Create a prompt template:

```markdown
# Claude ProvenanceCode Prompt Template

You are helping with a project that uses ProvenanceCode for decision tracking.

## Project Context
[Brief project description]

## Architectural Decisions
Before suggesting any code, review these decisions:

{{DECISION_SUMMARIES}}

## Current Task
[Your specific request]

## Rules
1. All suggestions must align with accepted decisions
2. If a decision is relevant, reference it by ID
3. If suggesting something that contradicts a decision, flag it
4. If no decision exists for your suggestion, recommend creating one
```

**Usage Example:**

```
I need to add a caching layer to our API.

Relevant decisions:
- #001: PostgreSQL for primary storage
- #003: RESTful APIs
- #005: Redis for session storage

Please suggest a caching strategy that aligns with these decisions.
```

Claude will respond with suggestions that use Redis (already approved) rather than introducing a new technology.

**Integration Script:**

```javascript
// tools/ask-claude-with-context.js
const fs = require('fs');
const path = require('path');

function loadDecisions() {
  const decisionsDir = 'provenance/decisions';
  const decisions = [];
  
  const dirs = fs.readdirSync(decisionsDir)
    .filter(d => d !== 'TEMPLATE');
  
  for (const dir of dirs) {
    const jsonPath = path.join(decisionsDir, dir, 'decision.json');
    if (fs.existsSync(jsonPath)) {
      const decision = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      if (decision.status === 'accepted' || decision.status === 'implemented') {
        decisions.push(decision);
      }
    }
  }
  
  return decisions;
}

function formatDecisionsForPrompt(decisions) {
  return decisions.map(d => 
    `- #${d.id}: ${d.title} (${d.status})\n  ${d.decision.substring(0, 200)}...`
  ).join('\n\n');
}

// Usage
const decisions = loadDecisions();
const context = formatDecisionsForPrompt(decisions);
console.log('Include this in your Claude prompt:\n\n', context);
```

### VS Code with Continue.dev

**Setup:**

Edit `.continuerc.json`:

```json
{
  "systemMessage": "You are a coding assistant that follows ProvenanceCode decisions. Always check provenance/decisions/ for architectural decisions before suggesting code.",
  "contextProviders": [
    {
      "name": "file",
      "params": {
        "glob": "provenance/decisions/*/decision.md"
      }
    }
  ],
  "rules": [
    "Reference decision IDs in significant code",
    "Flag potential violations of established patterns",
    "Suggest creating decisions for new architectural choices"
  ]
}
```

## AI Workflows

### Workflow 1: AI-Assisted Decision Creation

```bash
# 1. Ask AI to help draft a decision
# Prompt: "Help me create a decision record for choosing between REST and GraphQL"

# 2. AI generates draft decision.md

# 3. Create the decision structure
./tools/new-decision.sh api-architecture

# 4. Review and refine with AI
# Prompt: "Review this decision for completeness and clarity"

# 5. Commit the decision
git add provenance/decisions/006-api-architecture/
git commit -m "docs: decide on REST API architecture (#006)"
```

### Workflow 2: AI Code Review Against Decisions

```bash
# Before committing, ask AI:
# "Review my changes against our architectural decisions"

# AI will check:
- Does this follow established patterns?
- Are there relevant decisions that apply?
- Should we create a new decision?
```

**Example:**

```
User: Review this database query against our decisions

[Shows code using MongoDB]

AI: ⚠️ This code uses MongoDB, but decision #001 specifies PostgreSQL 
as our primary database. This change would contradict that decision.

Options:
1. Revise to use PostgreSQL
2. Update decision #001 if MongoDB is now preferred
3. Create a new decision for a specific MongoDB use case
```

### Workflow 3: Onboarding New Developers

```bash
# New developer prompt:
"Please explain the key architectural decisions in this project"

# AI reads provenance/decisions/ and summarizes:
# - Database: PostgreSQL with Prisma (#001)
# - API: REST with OpenAPI (#003)
# - Auth: JWT-based (#004)
# - Deployment: Kubernetes on AWS (#007)
```

## Best Practices

### ✅ Do

- **Update AI rules** when adding significant decisions
- **Test AI suggestions** against actual decisions
- **Use decision IDs** in prompts for specific context
- **Review AI-generated decisions** carefully before accepting
- **Include decision context** in code review requests

### ❌ Don't

- **Blindly trust AI** - it can hallucinate or misinterpret decisions
- **Skip human review** of decisions, even if AI-generated
- **Over-specify rules** - keep them high-level and maintainable
- **Forget to update** rules when decisions change
- **Use AI to retroactively justify** bad decisions

## Measuring AI Effectiveness

### Metrics to Track

1. **Alignment Rate**: % of AI suggestions that match decisions
2. **Decision References**: Count of AI-generated comments referencing decisions
3. **Violation Catches**: Times AI flagged a pattern violation
4. **Decision Quality**: Improvement in decision records with AI assistance

### Feedback Loop

```markdown
## AI Suggestion Log

| Date | Suggestion | Aligned? | Notes |
|------|------------|----------|-------|
| 2026-02-06 | Use MongoDB | ❌ | Contradicted #001 |
| 2026-02-06 | Add JWT middleware | ✅ | Followed #004 |
| 2026-02-07 | Suggest Redis cache | ✅ | Used existing #005 |
```

## Advanced Techniques

### Decision Embeddings

Generate embeddings of decision records for semantic search:

```javascript
// tools/embed-decisions.js
const { OpenAI } = require('openai');
const openai = new OpenAI();

async function embedDecision(decisionText) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: decisionText
  });
  return response.data[0].embedding;
}

// Store embeddings in a vector database
// AI can then find relevant decisions by similarity
```

### Auto-Generated Decision Summaries

```javascript
// tools/summarize-decisions.js
async function generateSummary(decisions) {
  const prompt = `
    Summarize these architectural decisions for an AI coding assistant:
    ${JSON.stringify(decisions, null, 2)}
    
    Format as bullet points with decision IDs.
  `;
  
  // Call AI API to generate summary
  return summary;
}
```

### Decision Change Detection

```yaml
# .github/workflows/ai-decision-check.yml
name: AI Decision Check

on: [pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check for decision changes
        run: |
          if git diff --name-only origin/main | grep -q "provenance/decisions"; then
            echo "Decision changes detected, update AI rules"
            # Trigger AI rules update
          fi
```

## Troubleshooting

### Issue: AI ignores decisions

**Solution**: 
- Verify rule files are in correct locations
- Check file format (Markdown, JSON)
- Simplify rules - may be too complex
- Explicitly mention decisions in prompts

### Issue: AI suggests contradictory patterns

**Solution**:
- Update AI rules to be more specific
- Add examples of good/bad patterns
- Reference specific decision IDs in rules

### Issue: Too many false positives

**Solution**:
- Refine decision criteria
- Add exceptions to rules
- Use more nuanced language in decisions

## Resources

- [Cursor Documentation](https://cursor.sh/docs)
- [GitHub Copilot Custom Instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot)
- [Claude API Documentation](https://docs.anthropic.com/claude/docs)
- [Continue.dev Configuration](https://continue.dev/docs/reference/config)

## Examples from Real Projects

### Example 1: E-commerce Platform

```markdown
# .cursorrules

## Payment Processing
- All payment handling must use Stripe SDK (decision #012)
- Never store credit card numbers (decision #013)
- All transactions must be idempotent (decision #014)

## Inventory Management
- Real-time stock updates via WebSockets (decision #015)
- Use optimistic locking for concurrent updates (decision #016)
```

### Example 2: Healthcare Application

```markdown
# .github/copilot-instructions.md

## HIPAA Compliance
- All PHI must be encrypted at rest and in transit (decision #020)
- Audit logging required for all data access (decision #021)
- No PHI in logs or error messages (decision #022)

## Data Access Patterns
- Use role-based access control (decision #023)
- All queries must be logged for audit (decision #024)
```

## Next Steps

1. Choose your primary AI assistant
2. Copy and customize the relevant rule file
3. Test with a few prompts
4. Refine rules based on results
5. Share learnings with your team

---

**Ready to integrate?** Start with the [Quick Start Guide](quickstart.md) to set up your first decision, then configure your AI assistant to read it.

