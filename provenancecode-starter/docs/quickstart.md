# ProvenanceCode Quick Start Guide

Get up and running with ProvenanceCode in your project in less than 10 minutes.

## Installation

### Step 1: Copy the Starter Pack

```bash
# Clone or copy the provenancecode-starter directory into your project
cp -r provenancecode-starter/* ./

# Or if you're starting fresh
git clone https://github.com/your-org/provenancecode-starter.git
cd provenancecode-starter
```

### Step 2: Install Dependencies

```bash
# Install Node.js dependencies for validation tools
npm init -y
npm install --save-dev ajv ajv-formats
```

### Step 3: Configure for Your Project

Edit `provenance/policies/require-decision-on-paths.yml` to specify which paths require decision records:

```yaml
paths:
  - "src/core/**"
  - "src/api/**"
  - "infrastructure/**"
```

## Creating Your First Decision

### Using the Shell Script

```bash
./tools/new-decision.sh my-first-decision
```

This will create a new decision directory at `provenance/decisions/001-my-first-decision/` with all necessary files.

### Using the Node.js Script

```bash
node tools/new-decision.js my-first-decision
```

### Manual Creation

1. Copy the `provenance/decisions/TEMPLATE/` directory
2. Rename it with a number prefix (e.g., `001-my-decision`)
3. Fill in the template files with your decision details

## Writing a Decision Record

A complete decision record includes four files:

### 1. decision.md (Human-Readable)

```markdown
# Decision: Use PostgreSQL for Primary Database

## Status
Accepted

## Context
We need a reliable, scalable database for our application...

## Decision
We will use PostgreSQL 14+ as our primary database...

## Consequences
- **Positive**: ACID compliance, mature ecosystem
- **Negative**: Higher operational complexity than NoSQL
```

### 2. decision.json (Machine-Readable)

```json
{
  "id": "001-use-postgresql",
  "title": "Use PostgreSQL for Primary Database",
  "status": "accepted",
  "date": "2026-02-06",
  "deciders": ["team-lead", "backend-team"],
  "context": "We need a reliable, scalable database...",
  "decision": "We will use PostgreSQL 14+...",
  "consequences": {
    "positive": ["ACID compliance", "Mature ecosystem"],
    "negative": ["Higher operational complexity"]
  }
}
```

### 3. prov.jsonld (Provenance Graph)

```json
{
  "@context": "https://www.w3.org/ns/prov",
  "@id": "decision:001-use-postgresql",
  "@type": "prov:Entity",
  "prov:wasGeneratedBy": {
    "@type": "prov:Activity",
    "prov:startedAtTime": "2026-02-06T10:00:00Z"
  }
}
```

### 4. c2pa.manifest.json (Authenticity)

```json
{
  "claim_generator": "ProvenanceCode/1.0",
  "assertions": [
    {
      "label": "c2pa.actions",
      "data": {
        "actions": [
          {
            "action": "c2pa.created",
            "when": "2026-02-06T10:00:00Z"
          }
        ]
      }
    }
  ]
}
```

## Configuring AI Assistants

### For Cursor IDE

1. Copy `rules/cursor-rules.md` to your project root as `.cursorrules`
2. Customize the rules for your project's specific needs

### For GitHub Copilot

1. Copy `rules/copilot-instructions.md` to `.github/copilot-instructions.md`
2. Copilot will automatically read these instructions

### For Claude Code

1. Use the content from `rules/claude-instructions.md` in your Claude prompts
2. Reference decision records in your conversations

## Setting Up CI/CD Validation

### GitHub Actions

The workflow in `.github/workflows/provenancecode.yml` will:
- Validate decision record schemas on every PR
- Check that changes to protected paths have associated decisions
- Score decision quality using the rubric

To enable:

```bash
git add .github/workflows/provenancecode.yml
git commit -m "Add ProvenanceCode validation workflow"
git push
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
validate-provenance:
  script:
    - node tools/validate-decision.js provenance/decisions/*
  only:
    - merge_requests
```

## Workflow

### Daily Development

1. **Before making architectural changes**:
   ```bash
   ./tools/new-decision.sh describe-change
   ```

2. **Fill in the decision record** with context and rationale

3. **Implement the change** referencing the decision ID in commits

4. **Review together**: Decision record + code changes

### With AI Assistants

1. **Ask AI to review decision records** before suggesting changes
2. **Reference decision IDs** in prompts: "Following decision 001..."
3. **Let AI validate** against established patterns

### Team Reviews

1. **Review decision records first**, then code
2. **Check decision quality** against the scoring rubric
3. **Update decisions** when requirements change

## Best Practices

### ✅ Do

- Create decisions BEFORE implementing major changes
- Link commits to decision IDs (e.g., `git commit -m "feat: implement #001"`)
- Keep decisions focused and atomic
- Update status as decisions evolve
- Include evidence and alternatives considered

### ❌ Don't

- Create decisions after-the-fact to justify existing code
- Make decisions too broad or vague
- Skip the "consequences" section
- Forget to update related decisions
- Delete old decisions (deprecate them instead)

## Next Steps

- Read [decision-records.md](decision-records.md) for detailed decision writing guide
- Review [ai-rules.md](ai-rules.md) for AI integration best practices
- Check [faq.md](faq.md) for common questions
- Explore the [TEMPLATE](../provenance/decisions/TEMPLATE/) for examples

## Getting Help

- Check the [FAQ](faq.md)
- Review existing decisions for patterns
- Open an issue on the ProvenanceCode GitHub repository
- Join the ProvenanceCode community discussions

---

**Ready to start?** Run `./tools/new-decision.sh my-first-decision` now!

