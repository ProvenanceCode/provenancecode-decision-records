# Claude Instructions for ProvenanceCode

Use these instructions when working with Claude Code or Claude API on projects using ProvenanceCode.

## Prompt Template

Include this context in your prompts to Claude:

```markdown
This project uses ProvenanceCode for architectural decision tracking. All 
architectural decisions are documented in provenance/decisions/.

Before suggesting code changes, please:
1. Review relevant decision records in provenance/decisions/
2. Ensure suggestions align with accepted/implemented decisions
3. Reference decision IDs in significant code
4. Flag potential violations of existing decisions
5. Recommend creating new decisions for architectural changes

Current key decisions:
[List your key decisions here - see examples below]
```

## Example Prompts

### Basic Task with Decision Context

```markdown
I need to add user authentication to our API.

Relevant decision:
- #004: JWT-based Authentication (status: implemented)
  - 15-minute access tokens
  - 7-day refresh tokens
  - HS256 signing
  - Stored in httpOnly cookies

Please implement authentication middleware following decision #004.
```

### Code Review with Decision Validation

```markdown
Please review this code against our architectural decisions.

Decision context:
- #001: PostgreSQL primary database
- #002: React + TypeScript frontend
- #003: RESTful APIs with versioning
- #004: JWT authentication required

[Paste code here]

Check for:
1. Compliance with established patterns
2. Proper decision references in comments
3. Any violations or deviations
4. Suggestions for better alignment
```

### Architecture Change Request

```markdown
I want to add GraphQL support to our API layer.

Current decision:
- #003: REST API Architecture (status: implemented)
  - All APIs use REST conventions
  - Versioned routes (/api/v1/...)
  - OpenAPI documentation

Please:
1. Explain how GraphQL relates to decision #003
2. Suggest whether to update #003 or create new decision
3. Help draft a decision record if needed
4. Provide implementation plan aligned with decisions
```

## Decision Context Format

When working with Claude, provide decision context in this format:

```markdown
## Current Architectural Decisions

### #001: Use PostgreSQL for Primary Database
- **Status**: implemented
- **Key points**:
  - All persistent data uses PostgreSQL
  - Connection pooling required
  - Schema changes via migrations
  - Use ORM, avoid raw SQL
- **Affects**: Database access, data models, migrations

### #002: React + TypeScript for Frontend
- **Status**: implemented  
- **Key points**:
  - Functional components with hooks
  - All components must be TypeScript
  - Props require explicit interfaces
  - No class components
- **Affects**: All frontend code

### #003: RESTful API Architecture
- **Status**: accepted
- **Key points**:
  - REST conventions (GET, POST, PUT, DELETE)
  - Versioned routes (/api/v1/...)
  - Authentication required on all endpoints
  - OpenAPI documentation mandatory
- **Affects**: API routes, controllers, documentation

### #004: JWT Authentication
- **Status**: implemented
- **Key points**:
  - 15-minute access tokens
  - 7-day refresh tokens
  - HS256 signing algorithm
  - Token rotation on refresh
- **Affects**: Authentication, authorization, session management
```

## Common Scenarios

### Scenario 1: Implementing a Feature

```markdown
Task: Implement user registration endpoint

Context from ProvenanceCode decisions:
- #001: PostgreSQL for data storage
- #003: REST API with /api/v1/ versioning
- #004: JWT auth (generate tokens on registration)

Please implement a registration endpoint that:
1. Follows REST conventions (decision #003)
2. Stores users in PostgreSQL (decision #001)
3. Returns JWT tokens (decision #004)
4. Includes decision references in code comments
```

### Scenario 2: Refactoring Existing Code

```markdown
I need to refactor this authentication code.

Current code:
[Paste code]

Relevant decision:
#004: JWT Authentication
- Must use HS256
- 15-minute access tokens
- 7-day refresh tokens
- Token rotation required

Please refactor to strictly follow decision #004 and add appropriate 
decision references in comments.
```

### Scenario 3: Evaluating New Technology

```markdown
We're considering using Redis for caching.

Current decisions:
- #001: PostgreSQL primary database (implemented)
- No caching decision exists yet

Please:
1. Explain how Redis caching relates to decision #001
2. Identify what needs to be decided
3. Help draft a decision record for Redis caching
4. Include: context, alternatives, consequences
```

### Scenario 4: Debugging Decision Conflicts

```markdown
This PR is failing ProvenanceCode validation.

Modified files:
- src/auth/session-storage.js (uses Redis)

Relevant decision:
- #004: JWT Authentication (no session storage, stateless tokens)

The code contradicts decision #004. Please:
1. Explain the conflict
2. Suggest how to align with decision #004
3. Or suggest updating decision #004 if requirements changed
```

## Asking Claude to Create Decisions

```markdown
Help me create a decision record for [topic].

Context:
- Problem: [Describe the problem]
- Current situation: [Current state]
- Constraints: [Technical/business/timeline constraints]

Please create:
1. decision.md with full documentation
2. decision.json with structured data
3. Suggested alternatives
4. Realistic consequences (positive AND negative)
5. Implementation guidance

Use the template from provenance/decisions/TEMPLATE/
```

## Decision Validation Prompts

```markdown
Please validate this decision record for completeness and quality.

[Paste decision.md content]

Check for:
1. All required sections present (context, decision, consequences)
2. At least 2 alternatives considered
3. Both positive AND negative consequences listed
4. Specific, actionable decision statement
5. Realistic consequences (not just propaganda)
6. Clear implementation guidance

Score using the rubric from provenance/policies/scoring-rubric.yml
```

## Code Review Template

```markdown
Please review this code for ProvenanceCode compliance.

**Code:**
[Paste code]

**Context:**
- Modified paths: [list paths]
- Related decisions: [list decision IDs]

**Review checklist:**
- [ ] Follows patterns from decisions
- [ ] Includes decision references in comments
- [ ] No violations of existing decisions
- [ ] New patterns have decision records
- [ ] Protected paths have required decisions

Please provide:
1. Compliance status (✅ / ⚠️ / ❌)
2. List of violations or issues
3. Suggestions for alignment
4. Recommendations for new decisions if needed
```

## Loading Decision Context

### Full Context

```markdown
Please read all decision records from provenance/decisions/ (except TEMPLATE).

For each decision, note:
- ID and title
- Status (only follow accepted/implemented)
- Key requirements and patterns
- Files/areas affected

Then help me with: [your task]
```

### Specific Context

```markdown
Please read these specific decisions:
- provenance/decisions/001-use-postgresql/decision.md
- provenance/decisions/004-jwt-authentication/decision.md

Then help me implement user authentication that follows both decisions.
```

### Summary Request

```markdown
Please summarize the key architectural decisions in provenance/decisions/.

Focus on:
- Technology choices (databases, frameworks, etc.)
- Architectural patterns (API style, auth approach, etc.)
- Critical constraints or requirements
- Current status of each

Format as a reference guide for development.
```

## Response Format Requests

### Ask for Decision References

```markdown
When suggesting code, please:
1. Include decision references in comments
2. Note which decision each pattern comes from
3. Format references as: "Decision: #XXX" or "Following decision #XXX"

Example:
/**
 * User service
 * Implements PostgreSQL access per decision #001
 * Uses connection pooling per decision #001 requirements
 */
```

### Ask for Compliance Checks

```markdown
After suggesting code, please verify:
1. Does this follow all relevant decisions?
2. Are there any potential conflicts?
3. Should any new decisions be created?
4. Are decision references included?

Provide a compliance summary at the end.
```

## Integration Workflow

### Step 1: Load Context
```markdown
Load ProvenanceCode decisions from provenance/decisions/
```

### Step 2: Work on Task
```markdown
[Your specific task]

Please ensure all suggestions:
- Follow accepted/implemented decisions
- Reference decision IDs in code
- Flag any potential conflicts
- Suggest new decisions when needed
```

### Step 3: Validate
```markdown
Validate the suggested code against decisions:
- #001: PostgreSQL usage
- #003: REST API conventions  
- #004: JWT authentication

Are there any violations or concerns?
```

### Step 4: Document
```markdown
Generate decision record documentation for this change if it introduces 
new patterns or architectural choices.
```

## Tips for Better Results

### ✅ Do

- Provide specific decision IDs and content
- Ask Claude to verify alignment with decisions
- Request decision references in code
- Ask for both technical and decision-level review
- Include relevant decision context in every prompt

### ❌ Don't

- Assume Claude remembers decisions from previous conversations
- Ask for code without providing decision context
- Skip decision validation
- Accept suggestions that violate decisions
- Forget to update decision rules as decisions change

## Example Complete Session

```markdown
# Initial Context
I'm working on a project using ProvenanceCode for decision tracking.

Current decisions:
- #001: PostgreSQL primary database (implemented)
- #002: React + TypeScript frontend (implemented)
- #003: REST APIs, versioned at /api/v1/ (accepted)
- #004: JWT authentication with 15min tokens (implemented)

# Task 1: Create API Endpoint
Create a POST /api/v1/posts endpoint for creating blog posts.

Requirements per decisions:
- Must use PostgreSQL (#001)
- Must follow REST conventions (#003)
- Must require JWT auth (#004)

Please implement with decision references in comments.

# Task 2: Review Response
[After Claude responds]

Please verify your suggestion against:
- Decision #001: Using PostgreSQL correctly?
- Decision #003: Following REST patterns?
- Decision #004: JWT auth included?

# Task 3: Document New Pattern
This introduces a new pattern for handling media uploads. Please draft a 
decision record for "Handle Media Uploads via S3" including:
- Context (why needed)
- Decision (how it works)
- Alternatives (local storage, other clouds)
- Consequences (costs, complexity, benefits)
- Relation to decision #001 (PostgreSQL stores metadata)
```

## Maintenance

Keep this file updated:
- Add new decisions to example contexts
- Remove deprecated decisions
- Update patterns as decisions evolve
- Refine prompts based on what works well

## Resources

- Decision records: `provenance/decisions/`
- Decision guide: `docs/decision-records.md`
- Quick start: `docs/quickstart.md`
- AI integration: `docs/ai-rules.md`

---

**Last Updated**: 2026-02-06  
**ProvenanceCode Version**: 1.0

<!-- Customize prompts below for your project -->

## Project-Specific Prompts

Add prompts specific to your project and decisions here.

