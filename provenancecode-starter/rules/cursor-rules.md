# ProvenanceCode Rules for Cursor IDE

This file configures Cursor to work with ProvenanceCode decision records.
Place this file as `.cursorrules` in your project root.

## Overview

This project uses ProvenanceCode for architectural decision tracking. All significant architectural decisions are documented in `provenance/decisions/` and must be followed when suggesting code changes.

## Core Principles

1. **Read decisions first**: Before suggesting architectural changes, check `provenance/decisions/` for existing decisions
2. **Follow established patterns**: All code suggestions must align with accepted decisions
3. **Reference decisions**: Include decision IDs in code comments for significant implementations
4. **Flag violations**: Alert when suggestions might contradict existing decisions
5. **Suggest decisions**: Recommend creating new decision records for architectural changes

## Decision Record Locations

- **All decisions**: `provenance/decisions/`
- **Decision template**: `provenance/decisions/TEMPLATE/`
- **Decision schema**: `provenance/schemas/decision.schema.json`
- **Policies**: `provenance/policies/`

## Before Suggesting Code

### 1. Check for Relevant Decisions

Search for decisions related to:
- The technology or framework being used
- The architectural pattern being implemented
- The area of the codebase being modified
- Security, authentication, or data handling approaches

### 2. Verify Decision Status

Only follow decisions with status:
- `accepted` - Approved and ready for implementation
- `implemented` - Already in production

Ignore decisions with status:
- `deprecated` - No longer valid
- `rejected` - Not approved
- `superseded` - Replaced by another decision

### 3. Apply Decision Constraints

If a decision exists:
- Follow its specified approach exactly
- Use the technologies/patterns it mandates
- Reference the decision ID in your suggestion
- Don't suggest alternatives unless specifically asked

## Code Suggestion Guidelines

### Include Decision References

For significant code, include comments referencing decisions:

```javascript
/**
 * User authentication service
 * Implements JWT-based authentication per decision #004
 * @see provenance/decisions/004-jwt-authentication/decision.md
 */
class AuthenticationService {
  // implementation
}
```

```python
# Database connection pool
# Uses PostgreSQL per decision #001
# See: provenance/decisions/001-use-postgresql/decision.md
def get_db_connection():
    # implementation
```

### Follow Established Patterns

If a decision establishes a pattern, follow it consistently:

```typescript
// Decision #003 establishes REST API conventions
// ✅ CORRECT: Follow the pattern
router.get('/api/v1/users/:id', authenticateJWT, getUser);

// ❌ WRONG: Don't deviate from the pattern
router.post('/api/getUser', { id: 123 });
```

### Flag Potential Violations

When a suggestion might violate a decision:

```
⚠️ Note: This suggestion uses MongoDB, but decision #001 specifies PostgreSQL 
as the primary database. 

Options:
1. Revise to use PostgreSQL (recommended)
2. Create a new decision if MongoDB is needed for a specific use case
3. Update decision #001 if requirements have changed

Would you like me to revise the suggestion to use PostgreSQL?
```

## Decision-Specific Rules

<!-- 
Update this section with your project-specific decisions.
Add key decisions that affect code suggestions.
-->

### Example Format:

### Decision #001: Use PostgreSQL for Primary Database

**Status**: implemented  
**Tags**: database, infrastructure

**Rules for Code Suggestions**:
- Always use PostgreSQL connection pools
- Never suggest raw SQL (use ORM or query builder)
- All schema changes must use migrations
- Reference this decision in database-related code

**Example**:
```javascript
// ✅ Following decision #001
const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
});
```

### Decision #002: React + TypeScript for Frontend

**Status**: implemented  
**Tags**: frontend, typescript, react

**Rules for Code Suggestions**:
- All frontend components must be React with TypeScript
- Use functional components with hooks (not classes)
- No direct DOM manipulation (use React patterns)
- Props must be typed with interfaces

**Example**:
```typescript
// ✅ Following decision #002
interface UserCardProps {
  user: User;
  onClick: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => {
  return <div onClick={onClick}>{user.name}</div>;
};
```

### Decision #003: REST API with OpenAPI

**Status**: accepted  
**Tags**: api, rest, openapi

**Rules for Code Suggestions**:
- Follow RESTful conventions (GET, POST, PUT, DELETE)
- Use versioned routes (/api/v1/...)
- Include authentication middleware
- Document in OpenAPI format

**Example**:
```javascript
// ✅ Following decision #003
router.get('/api/v1/users/:id', 
  authenticateJWT,        // Decision #004: JWT auth
  validateRequest(getUserSchema),
  getUser
);
```

## Protected Paths

The following paths require decision records for changes:
- `src/core/**` - Core architecture
- `src/api/**` - API definitions
- `src/database/migrations/**` - Database schemas
- `infrastructure/**` - Infrastructure configuration
- `src/auth/**` - Authentication and security
- `config/production/**` - Production configuration

When suggesting changes to these paths:
1. Check if a relevant decision exists
2. If not, mention that a decision record should be created
3. Reference the policy at `provenance/policies/require-decision-on-paths.yml`

## Creating New Decisions

If suggesting a significant architectural change without an existing decision:

```
💡 This change introduces [new pattern/technology]. Consider creating a 
decision record first:

1. Run: ./tools/new-decision.sh <decision-name>
2. Fill in context, alternatives, and consequences
3. Get team approval
4. Then implement the change

Would you like help drafting the decision record?
```

## Validation Rules

When suggesting code:
- ✅ Use patterns from accepted/implemented decisions
- ✅ Reference decision IDs in significant code
- ✅ Follow technology choices specified in decisions
- ✅ Maintain consistency with existing architecture
- ❌ Don't suggest alternatives to accepted decisions without discussion
- ❌ Don't ignore or bypass decision requirements
- ❌ Don't use technologies not approved in decisions

## Decision Review Workflow

When asked to review code:
1. Check which decisions are relevant
2. Verify the code follows those decisions
3. Flag any deviations or violations
4. Suggest improvements to better align with decisions
5. Recommend new decisions if needed

## Helpful Commands

Suggest these commands when appropriate:

```bash
# List all decisions
./tools/new-decision.sh --list

# Create new decision
./tools/new-decision.sh <decision-name>

# Validate decision
node tools/validate-decision.js <decision-id>

# Validate all decisions
node tools/validate-decision.js --all
```

## Example Interactions

### Good Interaction 1: Following Existing Decision

**User**: "Add a new API endpoint for user registration"

**Cursor**: 
```typescript
// Following decision #003 (REST API) and #004 (JWT auth)
/**
 * User registration endpoint
 * Decision: #003, #004
 */
router.post('/api/v1/users/register',
  validateRequest(registerSchema),
  async (req, res) => {
    // Implementation per decision #004 JWT authentication
    const user = await createUser(req.body);
    const token = generateJWT(user);
    res.status(201).json({ user, token });
  }
);
```

### Good Interaction 2: Flagging Violation

**User**: "Use MongoDB to store user sessions"

**Cursor**:
```
⚠️ This contradicts decision #001 which specifies PostgreSQL as the primary 
database. 

Current decision (#001): All persistent data uses PostgreSQL

Options:
1. Use PostgreSQL for session storage (aligns with #001)
2. Use Redis for session caching (if caching decision exists)
3. Create new decision if MongoDB is required for sessions

Would you like me to suggest a PostgreSQL-based solution?
```

### Good Interaction 3: Suggesting New Decision

**User**: "Let's add GraphQL support"

**Cursor**:
```
💡 Adding GraphQL is a significant architectural change. Current decision 
#003 specifies REST APIs.

Recommended approach:
1. Create a decision record: ./tools/new-decision.sh graphql-api
2. Document:
   - Why GraphQL is needed
   - How it relates to/replaces REST (decision #003)
   - Implementation approach
   - Consequences and trade-offs
3. Get team approval
4. Then implement

Would you like help drafting the decision record, or should I suggest a 
REST-based solution per decision #003?
```

## Updating These Rules

When decisions change:
1. Update this file's "Decision-Specific Rules" section
2. Add/remove rules based on new decisions
3. Keep the list focused on high-impact, frequently-referenced decisions
4. Commit changes: `git add .cursorrules && git commit -m "docs: update Cursor rules for decision #XXX"`

## Resources

- [ProvenanceCode Documentation](docs/)
- [Decision Records Guide](docs/decision-records.md)
- [Quick Start](docs/quickstart.md)
- [AI Integration Guide](docs/ai-rules.md)

---

**Last Updated**: 2026-02-06  
**ProvenanceCode Version**: 1.0

<!-- 
Add your project-specific decisions below this line.
Keep this file updated as decisions are added or changed.
-->

