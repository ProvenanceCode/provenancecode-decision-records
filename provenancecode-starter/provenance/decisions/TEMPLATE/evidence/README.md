# Evidence Directory

This directory contains supporting materials, research, and evidence for the decision record.

## Purpose

Evidence files provide:
- **Research materials** that informed the decision
- **Proof-of-concept** results and code
- **Performance benchmarks** and test results
- **Team feedback** and survey results
- **External references** and documentation
- **Analysis** documents and diagrams

## What to Include

### ✅ Do Include

- **Performance test results**: Benchmark outputs, load test reports
- **Security audits**: Vulnerability scans, penetration test results
- **POC code**: Links to repositories or archived code
- **Diagrams**: Architecture diagrams, sequence diagrams, flowcharts
- **Data analysis**: Spreadsheets, charts, statistical analysis
- **Meeting notes**: Key discussion points and decisions from meetings
- **Survey results**: Team feedback, user research data
- **Cost analysis**: Financial projections, ROI calculations
- **Third-party assessments**: Vendor evaluations, technology comparisons

### ❌ Don't Include

- **Large binary files** (use Git LFS or external storage with links)
- **Sensitive credentials** or secrets (reference secure storage location)
- **Personal information** (anonymize or aggregate data)
- **Copyrighted material** without permission (link instead)
- **Redundant copies** of public documentation (link to source)

## File Naming Conventions

Use descriptive, lowercase filenames with hyphens:

```
✅ Good:
- performance-benchmark-2026-02-06.md
- security-audit-summary.pdf
- poc-repository-link.txt
- team-survey-results.csv
- cost-analysis.xlsx

❌ Bad:
- test.txt
- Document1.pdf
- stuff.md
- FINALFINAL.xlsx
```

## File Types

### Markdown (.md)
Use for written reports, summaries, and analysis:
```markdown
# Performance Benchmark Results

## Test Configuration
- Date: 2026-02-06
- Tool: k6
- Duration: 10 minutes
- Target: 1000 concurrent users

## Results
- Average response time: 125ms
- 95th percentile: 250ms
- 99th percentile: 450ms
- Error rate: 0.05%

## Conclusion
System meets performance requirements under expected load.
```

### CSV/Excel (.csv, .xlsx)
Use for tabular data, survey results, metrics:
```csv
Metric,Before,After,Improvement
Response Time (ms),450,125,72%
Throughput (req/s),2000,8000,300%
Error Rate (%),1.2,0.05,96%
```

### PDF (.pdf)
Use for formal reports, external documents, presentations

### Images (.png, .jpg, .svg)
Use for diagrams, charts, screenshots:
- `architecture-diagram.png`
- `performance-chart.svg`
- `ui-mockup.jpg`

### Code Archives (.zip, .tar.gz)
Use for small POC code samples (or link to Git repos)

### Plain Text (.txt)
Use for logs, command outputs, simple lists

## Organization Strategies

### By Type
```
evidence/
  benchmarks/
    load-test-2026-02-06.md
    performance-results.csv
  research/
    technology-comparison.md
    vendor-evaluation.pdf
  diagrams/
    architecture.png
    sequence-diagram.svg
  feedback/
    team-survey.csv
    stakeholder-comments.md
```

### By Date
```
evidence/
  2026-01-15-initial-research.md
  2026-01-20-poc-results.md
  2026-02-01-performance-test.csv
  2026-02-05-security-audit.pdf
```

### By Phase
```
evidence/
  01-research/
    technology-comparison.md
  02-poc/
    poc-repository-link.txt
    poc-results.md
  03-testing/
    performance-benchmark.md
    load-test-results.csv
  04-review/
    security-audit.pdf
    team-feedback.md
```

## Referencing Evidence

### From decision.md

```markdown
## Evidence

### Performance Testing
Results show 4x improvement in throughput.
See: [Performance Benchmark](evidence/performance-benchmark-2026-02-06.md)

### Security Review
Passed security audit with no critical vulnerabilities.
See: [Security Audit Report](evidence/security-audit.pdf)

### Proof of Concept
Successful POC implementation in 2 weeks.
Repository: [POC GitHub](https://github.com/org/poc-repo)
Results: [POC Results](evidence/poc-results.md)
```

### From decision.json

```json
{
  "evidence": {
    "research": [
      {
        "title": "Performance Benchmark Results",
        "path": "evidence/performance-benchmark-2026-02-06.md",
        "type": "internal"
      }
    ],
    "proofOfConcept": {
      "repository": "https://github.com/org/poc-repo",
      "results": "evidence/poc-results.md"
    }
  }
}
```

## External Evidence

For evidence hosted externally, create a reference file:

**poc-repository-link.txt**:
```
POC Repository
URL: https://github.com/org/authentication-poc
Branch: main
Commit: a1b2c3d4e5f6
Date: 2026-01-30

Key files:
- src/jwt-implementation.js
- tests/performance-test.js
- docs/results.md
```

## Sensitive Information

For sensitive data, use placeholders with references:

**security-audit-summary.md**:
```markdown
# Security Audit Summary

Full audit report available at: [Internal Security Portal](https://internal.example.com/audits/2026-02)

## Public Summary
- Vulnerabilities found: 3 medium, 0 high, 0 critical
- All issues remediated before production deployment
- Meets SOC 2 Type II requirements
- Penetration testing passed

For detailed findings, contact Security Team.
```

## Maintenance

### Review Regularly
- **Monthly**: Check if evidence files are still relevant
- **Quarterly**: Archive outdated evidence
- **Annually**: Purge evidence for deprecated decisions

### Archive Old Evidence
When a decision is superseded or deprecated:
```bash
# Move evidence to archive
mkdir -p ../ARCHIVE/001-old-decision/evidence
mv evidence/* ../ARCHIVE/001-old-decision/evidence/
```

### Update Links
If evidence moves or URLs change, update references in:
- decision.md
- decision.json
- Related decisions

## Best Practices

### 1. Document Sources
Always note where evidence came from:
```markdown
## Source
- Collected by: Jane Smith (Performance Team)
- Date: 2026-02-06
- Tool: Apache JMeter 5.5
- Environment: Staging (AWS us-east-1)
```

### 2. Include Raw Data
When possible, include both:
- **Summary**: Human-readable interpretation
- **Raw data**: Original data files for verification

### 3. Version Control
Commit evidence files along with decision records:
```bash
git add provenance/decisions/005-decision-name/
git commit -m "docs: add decision #005 with performance evidence"
```

### 4. Make it Accessible
Ensure team members can:
- Find evidence easily (clear filenames)
- Understand evidence (include summaries)
- Reproduce tests (document methodology)

### 5. Respect Privacy
- Anonymize personal information
- Redact confidential data
- Follow GDPR/privacy regulations

## Examples

### Example 1: Performance Benchmark

**performance-benchmark-2026-02-06.md**:
```markdown
# Performance Benchmark - JWT Authentication

## Methodology
- Tool: k6 v0.45
- Duration: 10 minutes
- Ramp-up: 1 minute
- Users: 1000 concurrent
- Endpoint: /api/v1/auth/verify

## Results
| Metric | Value |
|--------|-------|
| Requests/sec | 8,245 |
| Avg response time | 121ms |
| P95 response time | 245ms |
| P99 response time | 389ms |
| Error rate | 0.03% |

## Conclusion
Exceeds requirement of <200ms P95 response time.

## Raw Data
See: performance-raw-data.csv
```

### Example 2: Team Survey

**team-survey-results.csv**:
```csv
Question,Strongly Agree,Agree,Neutral,Disagree,Strongly Disagree
"JWT is the right choice",12,8,2,1,0
"Implementation is feasible",10,11,2,0,0
"Timeline is realistic",8,9,5,1,0
```

### Example 3: Security Audit

**security-audit-summary.md**:
```markdown
# Security Audit Summary - JWT Implementation

**Auditor**: Internal Security Team
**Date**: 2026-02-05
**Scope**: JWT authentication design and POC

## Findings
- ✅ Token signing algorithm (HS256) approved
- ✅ Token expiration (15min) meets policy
- ⚠️ Refresh token rotation recommended
- ✅ Secret management via AWS Secrets Manager approved

## Recommendations
1. Implement refresh token rotation
2. Add rate limiting on token refresh endpoint
3. Monitor for token replay attempts

## Approval
Approved for production deployment with recommendations implemented.

Signed: Security Team Lead
Date: 2026-02-05
```

## Templates

### Benchmark Template
```markdown
# [Type] Benchmark - [Feature Name]

## Methodology
- **Tool**: 
- **Date**: 
- **Duration**: 
- **Configuration**: 

## Results
| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| | | | ✅/❌ |

## Conclusion

## Raw Data
Location:
```

### Research Template
```markdown
# Research: [Topic]

## Objective

## Methodology

## Findings
### Finding 1
### Finding 2

## Conclusion

## References
-
```

---

## Questions?

If you need help organizing evidence or have questions about what to include, see:
- [Decision Records Guide](../../../docs/decision-records.md)
- [FAQ](../../../docs/faq.md)

Or open an issue on the ProvenanceCode repository.

