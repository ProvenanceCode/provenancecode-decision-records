# Decision Records Guide

A comprehensive guide to writing high-quality decision records for ProvenanceCode.

## What is a Decision Record?

A decision record is a structured document that captures:
- **What** decision was made
- **Why** it was made (context and rationale)
- **When** it was made
- **Who** made it
- **What** the consequences are

Decision records create an immutable audit trail of your project's evolution.

## When to Create a Decision Record

### Always Create Records For

- ✅ Architectural decisions (framework choices, design patterns)
- ✅ Technology selections (databases, cloud providers, libraries)
- ✅ API design decisions (REST vs GraphQL, versioning strategy)
- ✅ Security policies (authentication methods, encryption standards)
- ✅ Data models and schemas
- ✅ Infrastructure choices (deployment strategies, CI/CD pipelines)
- ✅ Major refactoring decisions
- ✅ Deprecation of features or technologies

### Optional Records For

- 🤔 Implementation details (if they establish a pattern)
- 🤔 Configuration changes (if they affect multiple teams)
- 🤔 Process changes (if they're project-wide)

### Skip Records For

- ❌ Minor bug fixes
- ❌ Code formatting changes
- ❌ Dependency version updates (unless breaking)
- ❌ Documentation updates
- ❌ Obvious or trivial choices

## Decision Record Structure

### Required Sections

#### 1. Title
Clear, descriptive, action-oriented.

**Good Examples:**
- "Use React for Frontend Framework"
- "Migrate from Monolith to Microservices"
- "Adopt TypeScript for Type Safety"

**Bad Examples:**
- "Frontend" (too vague)
- "We discussed frameworks and decided on React after considering Vue and Angular because React has better community support" (too long)

#### 2. Status
Current state of the decision:

- **Proposed**: Under consideration
- **Accepted**: Approved and being implemented
- **Implemented**: Fully deployed
- **Deprecated**: No longer recommended
- **Superseded**: Replaced by another decision (link it)
- **Rejected**: Considered but not adopted

#### 3. Date
ISO 8601 format: `YYYY-MM-DD`

#### 4. Deciders
Who was involved in making the decision:
- Team names
- Role titles
- Key stakeholders

#### 5. Context
**The most important section.** Explain:
- What problem are we solving?
- What constraints exist?
- What are the business drivers?
- What's the current situation?

**Example:**
```markdown
## Context

Our current monolithic architecture is causing deployment bottlenecks. 
Each deployment requires coordination across 5 teams and takes 4+ hours. 
We're scaling to 50M+ users and need independent team deployment capability.

Current constraints:
- Must maintain backward compatibility during migration
- 6-month timeline for initial migration
- Team of 12 engineers
- AWS infrastructure only
```

#### 6. Decision
**What you decided to do.** Be specific and actionable.

**Example:**
```markdown
## Decision

We will migrate from our monolithic architecture to microservices using:

1. **Service boundaries**: Domain-Driven Design bounded contexts
2. **Communication**: REST APIs with async messaging (AWS SQS)
3. **Data**: Database-per-service pattern
4. **Migration strategy**: Strangler fig pattern over 18 months
5. **First services**: User Auth, Notifications, Reporting

Each service will be independently deployable and owned by a single team.
```

#### 7. Consequences

**Both positive and negative outcomes.**

**Example:**
```markdown
## Consequences

### Positive
- Teams can deploy independently (target: 20+ deploys/day)
- Better fault isolation
- Technology flexibility per service
- Easier to scale specific components
- Clearer team ownership

### Negative
- Increased operational complexity (monitoring, debugging)
- Network latency between services
- Data consistency challenges
- Learning curve for distributed systems
- Need for service mesh or API gateway
- Higher infrastructure costs initially

### Neutral
- Need to establish new communication patterns
- Requires investment in DevOps tooling
- Team restructuring around service boundaries
```

### Optional Sections

#### Alternatives Considered
What other options did you evaluate?

```markdown
## Alternatives Considered

### 1. Modular Monolith
**Pros**: Simpler operations, easier debugging
**Cons**: Still coupled deployment, harder to scale teams
**Why rejected**: Doesn't solve team scaling problem

### 2. Serverless (Lambda)
**Pros**: No infrastructure management, cost-effective
**Cons**: Vendor lock-in, cold start issues, 15-minute timeout
**Why rejected**: Not suitable for long-running processes

### 3. Keep Current Architecture
**Pros**: No migration cost
**Cons**: Team velocity continues to decline
**Why rejected**: Status quo is unsustainable
```

#### Evidence
Supporting data, research, or proof-of-concepts.

```markdown
## Evidence

- [POC Repository](https://github.com/org/microservices-poc)
- Performance testing results: `evidence/load-tests.md`
- Team survey on deployment pain points: `evidence/survey-results.pdf`
- Cost analysis: `evidence/cost-projections.xlsx`
```

#### Related Decisions
Link to other relevant decisions.

```markdown
## Related Decisions

- [002-use-docker-containers](../002-use-docker-containers/decision.md) - Container runtime
- [003-adopt-kubernetes](../003-adopt-kubernetes/decision.md) - Orchestration platform
- Supersedes: [000-monolithic-architecture](../000-monolithic-architecture/decision.md)
```

#### Notes
Additional context, updates, or learnings.

```markdown
## Notes

**Update 2026-03-15**: First three services successfully migrated. 
Deployment time reduced from 4h to 15min.

**Update 2026-06-20**: Added service mesh (Istio) to handle cross-cutting concerns.

**Lesson Learned**: Invest in observability early. Distributed tracing is essential.
```

## Writing Tips

### Be Specific
**Bad**: "We'll use a modern JavaScript framework"
**Good**: "We'll use React 18+ with TypeScript and Vite for build tooling"

### Be Honest
Include real negatives, not just positives. Future you will thank current you.

### Be Timely
Write decisions when made, not after implementation. Memory fades.

### Be Concise
Aim for 1-2 pages. Link to detailed docs rather than including everything.

### Be Searchable
Use clear terms that teammates will search for.

## The Four File Format

Each decision includes four files for different use cases:

### 1. decision.md (Markdown)
- **Purpose**: Human reading, code reviews, onboarding
- **Audience**: Developers, architects, managers
- **Format**: Rich markdown with examples and links

### 2. decision.json (JSON)
- **Purpose**: Tooling, automation, querying
- **Audience**: Scripts, CI/CD, dashboards
- **Format**: Structured data following schema

### 3. prov.jsonld (JSON-LD)
- **Purpose**: Provenance graph, linking, semantic web
- **Audience**: Advanced tooling, knowledge graphs
- **Format**: W3C PROV standard

### 4. c2pa.manifest.json (C2PA)
- **Purpose**: Authenticity, non-repudiation, audit trails
- **Audience**: Compliance, security teams
- **Format**: Content Authenticity Initiative standard

## Decision Lifecycle

### 1. Proposed
```bash
./tools/new-decision.sh use-graphql-api
# Edit decision.md, set status: proposed
git commit -m "docs: propose GraphQL API decision"
```

### 2. Discussion
- Team reviews the proposal
- Comments and suggestions
- May be rejected or revised

### 3. Accepted
```bash
# Update status in all files
git commit -m "docs: accept GraphQL API decision (#005)"
```

### 4. Implemented
```bash
# Update status when implementation is complete
git commit -m "docs: mark GraphQL API decision as implemented"
```

### 5. Deprecated/Superseded
```bash
# When decision is no longer current
git commit -m "docs: deprecate GraphQL API decision (superseded by #023)"
```

## Quality Checklist

Before committing a decision record:

- [ ] Title is clear and action-oriented
- [ ] Status is set correctly
- [ ] Date is in ISO format
- [ ] Deciders are listed
- [ ] Context explains the problem thoroughly
- [ ] Decision is specific and actionable
- [ ] Consequences include both positive and negative
- [ ] Alternatives considered (if applicable)
- [ ] Evidence is linked (if available)
- [ ] All four files are updated consistently
- [ ] JSON validates against schema
- [ ] Spelling and grammar checked
- [ ] Links are working

## Examples

See the [TEMPLATE directory](../provenance/decisions/TEMPLATE/) for a complete example.

### More Examples

```markdown
# Example: Simple Technology Choice

## Status
Accepted

## Context
We need to add real-time features to our web app. Current tech stack is 
Node.js/Express. Users need to see updates without refreshing.

## Decision
We will use Socket.IO for real-time communication.

## Consequences
**Positive**: Easy integration with Express, good browser support, automatic fallback
**Negative**: Vendor-specific protocol, larger bundle size than native WebSockets
```

```markdown
# Example: Security Decision

## Status
Implemented

## Context
Current authentication uses sessions stored in Redis. We're moving to a 
distributed architecture and need stateless auth. Must support mobile apps.

## Decision
Implement JWT-based authentication with:
- HS256 signing algorithm
- 15-minute access tokens
- 7-day refresh tokens in httpOnly cookies
- Token rotation on refresh

## Consequences
**Positive**: Stateless, works across microservices, mobile-friendly
**Negative**: Can't revoke JWTs before expiry, need refresh token strategy, 
token size larger than session ID

## Evidence
- Security audit: evidence/jwt-security-review.pdf
- Performance testing: 30% reduction in auth latency
```

## Common Pitfalls

### Pitfall 1: Writing After Implementation
**Problem**: Memory bias, justification instead of decision
**Solution**: Create record BEFORE coding

### Pitfall 2: Too Many Decisions
**Problem**: Noise, decision fatigue
**Solution**: Focus on significant, reusable decisions

### Pitfall 3: Too Few Details
**Problem**: Future readers can't understand context
**Solution**: Write for someone joining the team in 2 years

### Pitfall 4: No Consequences
**Problem**: Looks like propaganda, not realistic
**Solution**: Honest trade-offs build trust

### Pitfall 5: Inconsistent Files
**Problem**: JSON doesn't match Markdown
**Solution**: Use validation tools, update all files together

## Advanced Topics

### Linking Decisions to Code

```javascript
// In your code:
/**
 * GraphQL API implementation
 * Decision: #005-use-graphql-api
 * @see provenance/decisions/005-use-graphql-api/decision.md
 */
```

### Tagging in Commits

```bash
git commit -m "feat: implement GraphQL resolvers (#005)"
```

### Querying Decisions

```bash
# Find all accepted decisions about APIs
jq '.status == "accepted" and (.tags | index("api"))' \
  provenance/decisions/*/decision.json
```

### Generating Decision Reports

```bash
# Create a decision index
node tools/generate-decision-index.js > DECISIONS.md
```

## Resources

- [ADR Templates](https://github.com/joelparkerhenderson/architecture-decision-record)
- [When to Write an ADR](https://engineering.atspotify.com/2020/04/when-should-i-write-an-architecture-decision-record/)
- [W3C PROV](https://www.w3.org/TR/prov-overview/)
- [C2PA Specification](https://c2pa.org/specifications/specifications/1.0/specs/C2PA_Specification.html)

---

**Next Steps**: Create your first decision using the [Quick Start Guide](quickstart.md)

