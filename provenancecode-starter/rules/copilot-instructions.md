# GitHub Copilot Instructions for ProvenanceCode

This project uses ProvenanceCode for architectural decision tracking.

## Overview

All architectural decisions are documented in `provenance/decisions/`. When suggesting code, always check for and follow relevant decisions.

## Key Principles

1. **Read decisions before suggesting code**
2. **Follow established patterns from accepted decisions**
3. **Reference decision IDs in significant code**
4. **Don't suggest code that contradicts decisions**
5. **Recommend creating decisions for architectural changes**

## Decision Records Location

```
provenance/decisions/
├── 001-first-decision/
│   ├── decision.md
│   ├── decision.json
│   └── evidence/
├── 002-second-decision/
│   └── ...
└── TEMPLATE/
```

## Code Patterns

### Always Reference Decisions

When generating significant code, include decision references:

```javascript
/**
 * Authentication middleware
 * Implements JWT-based auth per decision #004
 * @see provenance/decisions/004-jwt-authentication/decision.md
 */
function authenticateJWT(req, res, next) {
  // implementation
}
```

```python
# Database connection handling
# Uses connection pooling per decision #001
# See: provenance/decisions/001-use-postgresql/decision.md
```

```typescript
/**
 * API client service
 * Follows REST conventions from decision #003
 * Decision: #003 (REST API Architecture)
 */
class ApiClient {
  // implementation
}
```

## Current Architectural Decisions

<!-- Update this section with your actual decisions -->

### Decision #001: Primary Database Technology

**Status**: implemented  
**Technology**: PostgreSQL  
**Key Rules**:
- All persistent data uses PostgreSQL
- Use connection pooling
- Schema changes via migrations only
- No raw SQL in application code (use ORM)

**Code Pattern**:
```javascript
// ✅ GOOD: Following decision #001
const pool = new Pool({ /* config */ });
const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

// ❌ BAD: Not following decision
const result = await mongoose.findById(userId); // Wrong database!
```

### Decision #002: Frontend Framework

**Status**: implemented  
**Technology**: React + TypeScript  
**Key Rules**:
- Use functional components with hooks
- All components must be TypeScript
- Props must have explicit interfaces
- No class components

**Code Pattern**:
```typescript
// ✅ GOOD: Following decision #002
interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  return <div onClick={() => onEdit(user.id)}>{user.name}</div>;
};

// ❌ BAD: Not following decision
class UserCard extends React.Component { } // Wrong pattern!
```

### Decision #003: API Architecture

**Status**: accepted  
**Technology**: RESTful APIs  
**Key Rules**:
- Use REST conventions (GET, POST, PUT, DELETE)
- Version all routes (/api/v1/...)
- Require authentication middleware
- OpenAPI documentation required

**Code Pattern**:
```javascript
// ✅ GOOD: Following decision #003
router.get('/api/v1/users/:id', 
  authenticateJWT,  // Required by decision
  validateRequest(getUserSchema),
  async (req, res) => {
    // implementation
  }
);

// ❌ BAD: Not following decision
router.post('/getUser', async (req, res) => { /* ... */ }); // Wrong pattern!
```

### Decision #004: Authentication Method

**Status**: implemented  
**Technology**: JWT (JSON Web Tokens)  
**Key Rules**:
- Access tokens: 15-minute expiration
- Refresh tokens: 7-day expiration
- HS256 signing algorithm
- Token rotation on refresh

**Code Pattern**:
```javascript
// ✅ GOOD: Following decision #004
const accessToken = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);

// ❌ BAD: Not following decision
const session = await Session.create({ userId }); // Wrong auth method!
```

## Protected Paths

These paths require decision records for changes:

- `src/core/**` - Core architecture
- `src/api/**` - API definitions
- `src/database/migrations/**` - Database schemas
- `infrastructure/**` - Infrastructure config
- `src/auth/**` - Authentication
- `config/production/**` - Production config

When suggesting changes to these paths, mention the need for decision records.

## Code Suggestions

### Pattern: Database Queries

```javascript
// Following decision #001 (PostgreSQL)
const users = await db.query(
  'SELECT * FROM users WHERE active = $1',
  [true]
);
```

### Pattern: API Endpoints

```javascript
// Following decision #003 (REST API)
router.get('/api/v1/resources/:id', authenticate, getResource);
router.post('/api/v1/resources', authenticate, validate, createResource);
router.put('/api/v1/resources/:id', authenticate, validate, updateResource);
router.delete('/api/v1/resources/:id', authenticate, deleteResource);
```

### Pattern: React Components

```typescript
// Following decision #002 (React + TypeScript)
interface Props {
  data: DataType;
  onAction: (id: string) => void;
}

export const Component: React.FC<Props> = ({ data, onAction }) => {
  const [state, setState] = useState(initialState);
  
  useEffect(() => {
    // side effects
  }, [data]);
  
  return <div>{/* JSX */}</div>;
};
```

### Pattern: Authentication Middleware

```javascript
// Following decision #004 (JWT)
function authenticateJWT(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}
```

## When to Flag Issues

Alert the developer when:

1. **Using wrong technology**: Suggesting MongoDB when decision #001 specifies PostgreSQL
2. **Wrong pattern**: Suggesting class components when decision #002 specifies functional
3. **Missing authentication**: API endpoints without auth when decision #004 requires it
4. **Breaking conventions**: Not following REST patterns specified in decision #003

### Example Alerts

```javascript
// ⚠️ This uses MongoDB but decision #001 specifies PostgreSQL
// Consider: const result = await db.query('SELECT ...')

// ⚠️ This is a class component but decision #002 requires functional components
// Consider: const Component: React.FC<Props> = (props) => { }

// ⚠️ This endpoint lacks authentication required by decision #004
// Add: router.get('/api/v1/users', authenticateJWT, getUsers)
```

## Decision References in Comments

Always include decision references for:
- Authentication/authorization code
- Database access
- API endpoints
- Configuration loading
- External service integrations
- Security-sensitive operations

Format: `Decision: #XXX` or `Implements decision #XXX`

## Creating New Decisions

If suggesting a new architectural approach, mention:

```
💡 This introduces [new pattern/technology]. Consider creating a decision record:

1. Run: ./tools/new-decision.sh <name>
2. Document context, alternatives, consequences
3. Get team approval
4. Then implement

See: docs/decision-records.md
```

## Validation

Before suggesting code, verify:
- [ ] Is there a relevant decision?
- [ ] Does this follow the decision's requirements?
- [ ] Should I reference the decision in comments?
- [ ] Will this contradict any existing decisions?

## Resources

- All decisions: `provenance/decisions/`
- Decision guide: `docs/decision-records.md`
- Quick start: `docs/quickstart.md`
- Policies: `provenance/policies/`

## Tools

```bash
# List decisions
./tools/new-decision.sh --list

# Create decision
./tools/new-decision.sh <name>

# Validate decision
node tools/validate-decision.js <decision-id>
```

## Example Completions

### Good Completion 1: Database Query

```javascript
// User asks: "fetch all active users"
// Copilot suggests (following decision #001):

/**
 * Fetch all active users
 * Uses PostgreSQL per decision #001
 */
async function getActiveUsers() {
  const result = await db.query(
    'SELECT id, name, email FROM users WHERE active = $1',
    [true]
  );
  return result.rows;
}
```

### Good Completion 2: React Component

```typescript
// User asks: "create user list component"
// Copilot suggests (following decision #002):

/**
 * User list component
 * Implements React patterns per decision #002
 */
interface UserListProps {
  users: User[];
  onUserSelect: (userId: string) => void;
}

export const UserList: React.FC<UserListProps> = ({ users, onUserSelect }) => {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id} onClick={() => onUserSelect(user.id)}>
          {user.name}
        </li>
      ))}
    </ul>
  );
};
```

### Good Completion 3: API Route

```javascript
// User asks: "add endpoint to create posts"
// Copilot suggests (following decisions #003 and #004):

/**
 * Create post endpoint
 * Follows REST conventions per decision #003
 * Requires authentication per decision #004
 */
router.post('/api/v1/posts',
  authenticateJWT,  // Decision #004
  validateRequest(createPostSchema),
  async (req, res) => {
    try {
      const post = await db.query(
        'INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3) RETURNING *',
        [req.body.title, req.body.content, req.user.id]
      );
      res.status(201).json(post.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create post' });
    }
  }
);
```

## Notes

- Keep this file updated as decisions change
- Add new decisions to the "Current Architectural Decisions" section
- Remove deprecated decisions
- Focus on decisions that affect daily code suggestions

---

**Last Updated**: 2026-02-06  
**ProvenanceCode Version**: 1.0

<!-- Add your project-specific decisions below -->

