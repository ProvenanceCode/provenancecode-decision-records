# ProvenanceCode FAQ

Frequently asked questions about using ProvenanceCode in your projects.

## General Questions

### What is ProvenanceCode?

ProvenanceCode is a framework for capturing and tracking the provenance (origin and history) of code decisions. It helps teams document why code exists in its current form and provides context for AI assistants to make better suggestions.

### Is this the same as Architecture Decision Records (ADRs)?

ProvenanceCode builds on ADR concepts but goes further:
- Multiple formats (Markdown, JSON, JSON-LD, C2PA)
- AI assistant integration
- Automated validation and policy enforcement
- Provenance graph capabilities
- Content authenticity tracking

### Do I need to adopt all features at once?

No! Start simple:
1. **Week 1**: Basic Markdown decision records
2. **Week 2**: Add JSON for tooling
3. **Week 3**: Configure AI assistants
4. **Week 4**: Enable CI/CD validation

### What's the learning curve?

- **Basic usage**: 30 minutes to write first decision
- **Team adoption**: 1-2 weeks to establish habits
- **Advanced features**: 1 month for full automation

## Decision Writing

### How long should a decision record be?

**Target**: 1-2 pages (500-1000 words)

- Too short (<250 words): Probably missing context
- Too long (>2000 words): Consider splitting or linking to separate docs

### How do I know if something deserves a decision record?

Ask yourself:
1. Will this affect multiple files/components?
2. Will future developers wonder "why did they do this?"
3. Does this establish a pattern others should follow?
4. Would I want to know the reasoning when onboarding?

If yes to 2+ questions, write a decision record.

### What if the decision seems obvious?

If it's obvious NOW, it might not be in 2 years. Write it anyway. Future obvious decisions may reference current obvious decisions.

### Can I update old decisions?

**Yes**, but with constraints:
- Add "Notes" or "Updates" sections for minor changes
- Create a new decision that "supersedes" for major changes
- Never delete old decisions - mark them as "deprecated"

### What if we made the wrong decision?

That's valuable information!

1. Create a new decision explaining what you learned
2. Reference the original decision
3. Document what changed (requirements, evidence, etc.)
4. Update original decision status to "superseded"

Example:
```markdown
## Notes
**Update 2026-06-01**: This decision was superseded by #025-migrate-to-graphql
after we discovered REST wasn't scaling for our mobile apps.
```

### Do I need all four file formats?

**Minimum**: `decision.md` (human-readable)

**Recommended**: `decision.md` + `decision.json` (for tooling)

**Full**: All four formats for complete provenance tracking

Start with Markdown, add others as needed.

## Team Adoption

### How do I convince my team to use this?

Start small:
1. Document 1-2 existing important decisions
2. Reference them in code review: "This follows the pattern from decision #001"
3. Demonstrate value: "New teammate onboarded faster using decision records"
4. Iterate based on feedback

### Should every team member write decisions?

**Decision authority** can be limited (architects, leads), but **decision creation** should be accessible to all. Junior developers often ask the best "why" questions.

### How do we review decision records?

Treat them like code:
1. Open a PR with the decision record
2. Team reviews for completeness, clarity, and consequences
3. Discuss alternatives
4. Merge when consensus is reached
5. Update status from "proposed" to "accepted"

### What if people don't keep records updated?

Make it part of the workflow:
- CI/CD checks enforce decision records for protected paths
- Code review checklist includes decision references
- Retrospectives review decision record quality
- Celebrate good decision documentation

## Technical Questions

### What file structure should I use?

**Recommended**:
```
provenance/
  decisions/
    001-decision-name/
      decision.md
      decision.json
      prov.jsonld
      c2pa.manifest.json
      evidence/
        (supporting files)
```

**Alternative** (flat structure):
```
provenance/
  decisions/
    001-decision-name.md
    001-decision-name.json
```

### How do I number decisions?

**Sequential**: 001, 002, 003, ...
- Simple, predictable
- Shows decision timeline
- Can have gaps (deleted proposals)

**Date-based**: 20260206-decision-name
- Chronological clarity
- No numbering conflicts in PRs
- Longer IDs

**Hybrid**: 001-20260206-decision-name

Choose one and stick with it.

### Can I organize decisions by category?

**Yes**, but maintain a flat list:

```
provenance/
  decisions/
    001-database-postgresql/          # Category: Database
    002-frontend-react/                # Category: Frontend
    003-api-rest/                      # Category: API
```

Use tags in `decision.json` rather than folder nesting:

```json
{
  "id": "001-database-postgresql",
  "tags": ["database", "infrastructure", "postgresql"]
}
```

### How do I search decisions?

**By file**:
```bash
grep -r "PostgreSQL" provenance/decisions/
```

**By JSON**:
```bash
jq '.tags | index("database")' provenance/decisions/*/decision.json
```

**Create an index**:
```bash
node tools/generate-decision-index.js > DECISIONS.md
```

### Can I use this with GitLab/Bitbucket?

Yes! The core concept works with any Git-based system:
- **GitHub**: Use provided workflows
- **GitLab**: Adapt workflows to `.gitlab-ci.yml`
- **Bitbucket**: Use Bitbucket Pipelines
- **Other**: Run validation scripts in your CI/CD

### What about monorepos?

Two approaches:

**1. Centralized** (recommended):
```
monorepo/
  provenance/
    decisions/           # Shared decisions
  packages/
    api/
    web/
    mobile/
```

**2. Distributed**:
```
monorepo/
  packages/
    api/
      provenance/decisions/
    web/
      provenance/decisions/
```

## AI Integration

### Which AI assistant works best?

All major assistants work:
- **Cursor**: Native `.cursorrules` support
- **GitHub Copilot**: Custom instructions
- **Claude**: Prompt engineering
- **Amazon CodeWhisperer**: Policy files
- **Tabnine**: Custom models

Choose based on your existing tools.

### Do I need to update AI rules for every decision?

**No**. Update for significant, high-impact decisions that establish patterns:
- Framework choices
- Security policies
- API conventions
- Data access patterns

Minor decisions don't need explicit AI rules.

### Can AI write decisions for me?

AI can **draft** decisions, but humans should:
- Validate technical accuracy
- Ensure completeness
- Verify consequences are realistic
- Add team-specific context

Think of AI as a writing assistant, not a decision maker.

### How do I know if AI is following decisions?

Test with prompts:
```
"Create a new database model for users"
```

Check if AI:
- Uses PostgreSQL (if that's your decision)
- Follows your ORM pattern
- Includes migration files
- References the decision ID

## Workflow Integration

### When should I create a decision?

**Ideal timing**: Before implementation

**Real world**:
- **Before**: Major architectural changes
- **During**: As you discover patterns worth documenting
- **After**: Retroactively for important existing patterns (with "Date" = original decision date)

### How do I link decisions to code?

**In comments**:
```javascript
/**
 * User authentication service
 * Implements decision #004 (JWT-based auth)
 * @see provenance/decisions/004-jwt-authentication/decision.md
 */
```

**In commits**:
```bash
git commit -m "feat: implement user authentication (#004)"
```

**In PRs**:
```markdown
## Changes
Implements JWT authentication

## Related Decisions
- #004: JWT-based authentication
- #002: PostgreSQL for user storage
```

### Can I use this with Jira/Linear/etc?

Yes! Link both ways:

**In decision record**:
```markdown
## Related Issues
- [PROJ-123](https://jira.example.com/browse/PROJ-123)
- [PROJ-124](https://jira.example.com/browse/PROJ-124)
```

**In Jira ticket**:
```
Architectural Decision: provenance/decisions/005-microservices/
```

### How do I handle private/confidential information?

**Don't include it in decisions**. Instead:

```markdown
## Context
We need to migrate from our legacy authentication system (see internal doc 
#AUTH-001) to a modern solution.

## Security Considerations
See security review: [Internal Document](https://internal.example.com/review)
```

Keep decisions in public repo, link to private docs.

## Maintenance

### How often should I review decisions?

**Regular reviews**:
- **Monthly**: Check if new decisions are needed
- **Quarterly**: Review "proposed" decisions (accept or reject)
- **Annually**: Audit all decisions for accuracy

**Triggered reviews**:
- Major technology upgrades
- Team restructuring
- Product pivots
- Security incidents

### What do I do with outdated decisions?

**Don't delete**. Instead:

1. Update status to "deprecated"
2. Add note explaining why
3. Link to superseding decision (if any)

```markdown
## Status
Deprecated (2026-05-15)

## Notes
This decision was superseded by #025-graphql-api after we discovered REST 
wasn't meeting our mobile app requirements. See the new decision for details.
```

### How do I migrate from ADRs to ProvenanceCode?

1. Keep existing ADRs as `decision.md` files
2. Convert to directory structure:
   ```bash
   mkdir provenance/decisions/001-existing-adr
   mv docs/adr/001-existing-adr.md provenance/decisions/001-existing-adr/decision.md
   ```
3. Generate `decision.json` from Markdown:
   ```bash
   node tools/convert-adr-to-json.js
   ```
4. Add new decisions using ProvenanceCode format

### Can I export decisions to other formats?

Yes! Create exporters:

**To PDF**:
```bash
pandoc provenance/decisions/*/decision.md -o decisions.pdf
```

**To HTML**:
```bash
node tools/generate-decision-website.js
```

**To Confluence/Notion**:
```bash
node tools/export-to-confluence.js
```

## Troubleshooting

### CI validation is failing

**Check**:
1. All required fields present in `decision.json`
2. JSON validates against schema
3. Dates in ISO 8601 format (YYYY-MM-DD)
4. Status is one of: proposed, accepted, implemented, deprecated, superseded, rejected

### AI isn't reading decisions

**Solutions**:
1. Verify rule file location (`.cursorrules`, `.github/copilot-instructions.md`)
2. Check file format (plain text, not binary)
3. Simplify rules - may be too complex
4. Explicitly reference decisions in prompts

### Decision records getting too long

**Solutions**:
1. Split into multiple decisions
2. Move detailed technical specs to linked docs
3. Use "Evidence" section for supporting materials
4. Keep decision.md focused on "what" and "why", not "how"

### Team isn't writing decisions

**Possible causes**:
- Process too heavy → Simplify templates
- Value unclear → Share success stories
- Tools lacking → Improve scripts
- Not enforced → Add CI checks

## Advanced Topics

### Can I version decisions?

**Recommended**: Create new decisions that supersede old ones

**Alternative**: Use Git history
```bash
git log -- provenance/decisions/001-database/decision.md
```

### How do I handle experimental decisions?

Use status: "proposed" for experiments:

```json
{
  "status": "proposed",
  "tags": ["experimental", "poc"],
  "review_date": "2026-03-01"
}
```

Review at `review_date` and promote to "accepted" or "rejected".

### Can I use this for non-code decisions?

Yes! Examples:
- Process changes
- Tool selections
- Team structure
- Deployment strategies
- Incident response procedures

### How do I measure ROI?

Track:
- **Time saved**: Onboarding duration, decision explanation time
- **Quality**: Code review comments about "why?", architectural drift incidents
- **AI effectiveness**: % of AI suggestions that align with patterns
- **Team satisfaction**: Survey developers quarterly

### Can I integrate with IDEs beyond AI assistants?

Yes! Create IDE plugins:
- **VS Code**: Extension that shows relevant decisions
- **IntelliJ**: Plugin that links code to decisions
- **Vim**: Command to search decisions

Example VS Code extension:
```javascript
// Shows decision tooltips when hovering over decision IDs
vscode.languages.registerHoverProvider('*', {
  provideHover(document, position, token) {
    // Parse decision ID from comment
    // Load decision.json
    // Return hover tooltip
  }
});
```

## Getting Help

### Where can I ask questions?

- **GitHub Issues**: [ProvenanceCode Repository](https://github.com/provenancecode/ProvenanceCode/issues)
- **Discussions**: GitHub Discussions (coming soon)
- **Email**: [Your contact email]

### How can I contribute?

Contributions welcome:
- Improve documentation
- Add tool integrations
- Share examples
- Report issues
- Suggest features

See [CONTRIBUTING.md](https://github.com/provenancecode/ProvenanceCode/CONTRIBUTING.md)

### Where can I see examples?

- [TEMPLATE directory](../provenance/decisions/TEMPLATE/)
- Example projects (coming soon)
- [ProvenanceCode showcase](https://github.com/topics/provenancecode)

## Resources

- [Quick Start Guide](quickstart.md)
- [Decision Records Guide](decision-records.md)
- [AI Integration Guide](ai-rules.md)
- [ProvenanceCode GitHub](https://github.com/provenancecode/ProvenanceCode)

---

**Still have questions?** Open an issue on the [ProvenanceCode repository](https://github.com/provenancecode/ProvenanceCode/issues).

