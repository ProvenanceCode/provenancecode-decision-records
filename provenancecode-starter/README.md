# ProvenanceCode Starter Pack

A comprehensive starter template for integrating ProvenanceCode into your software projects. This pack provides everything you need to start tracking architectural decisions, maintaining code provenance, and enabling AI-assisted development with proper decision context.

## What is ProvenanceCode?

ProvenanceCode is a framework for capturing, tracking, and leveraging the provenance of code decisions throughout the software development lifecycle. It enables teams to:

- 📝 Document architectural decisions with rich context
- 🔍 Track the evolution and rationale behind code changes
- 🤖 Provide AI assistants with decision context for better suggestions
- ✅ Validate changes against established policies and patterns
- 🔗 Link code artifacts to their decision provenance

## Quick Start

1. **Copy this starter pack** into your project root
2. **Review and customize** the policies in `provenance/policies/`
3. **Set up your first decision** using `./tools/new-decision.sh`
4. **Configure your AI assistant** using the rules in `rules/`
5. **Enable CI/CD validation** using the GitHub workflow in `.github/workflows/`

For detailed instructions, see [docs/quickstart.md](docs/quickstart.md)

## Structure

```
provenancecode-starter/
├── README.md                          # This file
├── LICENSE                            # MIT License
├── docs/                              # Documentation
│   ├── quickstart.md                  # Getting started guide
│   ├── decision-records.md            # How to write decision records
│   ├── ai-rules.md                    # Guide for AI integration
│   └── faq.md                         # Frequently asked questions
├── provenance/                        # Core provenance tracking
│   ├── decisions/                     # Decision records repository
│   │   └── TEMPLATE/                  # Template for new decisions
│   ├── schemas/                       # JSON schemas for validation
│   └── policies/                      # Policy definitions
├── .github/workflows/                 # CI/CD automation
│   └── provenancecode.yml            # Validation workflow
├── tools/                             # Helper scripts
│   ├── new-decision.sh               # Create new decision (bash)
│   ├── new-decision.js               # Create new decision (Node.js)
│   └── validate-decision.js          # Validate decision format
└── rules/                             # AI assistant configuration
    ├── cursor-rules.md               # Cursor IDE rules
    ├── copilot-instructions.md       # GitHub Copilot instructions
    └── claude-instructions.md        # Claude Code instructions
```

## Features

### 📚 Decision Records
Structured decision documentation with multiple format support:
- Markdown for human readability
- JSON for programmatic access
- JSON-LD for semantic linking
- C2PA manifests for authenticity

### 🤖 AI Integration
Pre-configured rules for popular AI coding assistants:
- Cursor IDE
- GitHub Copilot
- Claude Code

AI assistants can read decision context and suggest changes that align with your architectural patterns.

### ✅ Automated Validation
- Schema validation for decision records
- Policy enforcement on PRs
- Scoring rubrics for decision quality
- Path-based decision requirements

### 🔧 Developer Tools
- Quick decision creation scripts
- Validation utilities
- Template customization

## Use Cases

- **Architectural Decision Records (ADRs)**: Track why you chose certain technologies or patterns
- **Code Review Context**: Provide reviewers with decision background
- **Onboarding**: Help new team members understand historical decisions
- **AI-Assisted Development**: Give AI tools the context they need
- **Compliance**: Maintain audit trails for regulatory requirements
- **Technical Debt**: Document known issues and their rationale

## Requirements

- Git repository
- Node.js 14+ (for JavaScript tools)
- Bash shell (for shell scripts)
- Optional: GitHub Actions (for CI/CD)

## Contributing

Contributions are welcome! Please see the main ProvenanceCode repository for contribution guidelines.

## License

MIT License - See [LICENSE](LICENSE) file for details

## Learn More

- [Documentation](docs/)
- [ProvenanceCode GitHub](https://github.com/provenancecode/ProvenanceCode)
- [Examples and Templates](provenance/decisions/TEMPLATE/)

---

**Getting Started**: Run `./tools/new-decision.sh my-first-decision` to create your first decision record.

