#!/bin/bash
# ProvenanceCode: Create a new decision record
# Usage: ./tools/new-decision.sh <decision-name>

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DECISIONS_DIR="provenance/decisions"
TEMPLATE_DIR="$DECISIONS_DIR/TEMPLATE"
SCHEMA_PATH="provenance/schemas/decision.schema.json"

# Functions
print_usage() {
    echo "Usage: $0 <decision-name>"
    echo ""
    echo "Creates a new decision record from the template."
    echo ""
    echo "Examples:"
    echo "  $0 use-postgresql"
    echo "  $0 jwt-authentication"
    echo "  $0 migrate-to-microservices"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -l, --list     List existing decisions"
}

list_decisions() {
    echo -e "${BLUE}📋 Existing Decisions:${NC}"
    echo ""
    
    if [ ! -d "$DECISIONS_DIR" ]; then
        echo -e "${YELLOW}No decisions directory found${NC}"
        return
    fi
    
    for dir in "$DECISIONS_DIR"/*; do
        if [ -d "$dir" ] && [ "$(basename "$dir")" != "TEMPLATE" ]; then
            decision_name=$(basename "$dir")
            
            if [ -f "$dir/decision.json" ]; then
                title=$(node -p "try { require('./$dir/decision.json').title } catch(e) { 'N/A' }" 2>/dev/null || echo "N/A")
                status=$(node -p "try { require('./$dir/decision.json').status } catch(e) { 'unknown' }" 2>/dev/null || echo "unknown")
                
                case "$status" in
                    "accepted") status_icon="✅" ;;
                    "implemented") status_icon="🚀" ;;
                    "proposed") status_icon="💭" ;;
                    "deprecated") status_icon="⚠️" ;;
                    "rejected") status_icon="❌" ;;
                    *) status_icon="❓" ;;
                esac
                
                echo -e "$status_icon  ${GREEN}$decision_name${NC} - $title (${YELLOW}$status${NC})"
            else
                echo -e "   ${GREEN}$decision_name${NC}"
            fi
        fi
    done
}

get_next_number() {
    local max_num=0
    
    for dir in "$DECISIONS_DIR"/*; do
        if [ -d "$dir" ]; then
            dirname=$(basename "$dir")
            if [[ $dirname =~ ^([0-9]+)- ]]; then
                num=${BASH_REMATCH[1]}
                num=$((10#$num))  # Force base-10 interpretation
                if [ $num -gt $max_num ]; then
                    max_num=$num
                fi
            fi
        fi
    done
    
    next_num=$((max_num + 1))
    printf "%03d" $next_num
}

sanitize_name() {
    echo "$1" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-'
}

create_decision() {
    local decision_name="$1"
    
    # Sanitize the decision name
    decision_name=$(sanitize_name "$decision_name")
    
    if [ -z "$decision_name" ]; then
        echo -e "${RED}❌ Invalid decision name${NC}"
        exit 1
    fi
    
    # Get next decision number
    local decision_number=$(get_next_number)
    local full_name="${decision_number}-${decision_name}"
    local decision_path="$DECISIONS_DIR/$full_name"
    
    # Check if decision already exists
    if [ -d "$decision_path" ]; then
        echo -e "${RED}❌ Decision already exists: $full_name${NC}"
        exit 1
    fi
    
    # Check if template exists
    if [ ! -d "$TEMPLATE_DIR" ]; then
        echo -e "${RED}❌ Template directory not found: $TEMPLATE_DIR${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}📝 Creating new decision: ${GREEN}$full_name${NC}"
    echo ""
    
    # Copy template
    cp -r "$TEMPLATE_DIR" "$decision_path"
    echo -e "${GREEN}✅ Copied template${NC}"
    
    # Get current date
    current_date=$(date +%Y-%m-%d)
    current_datetime=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    
    # Update decision.json
    if [ -f "$decision_path/decision.json" ]; then
        # Create temporary file with updates
        node -e "
        const fs = require('fs');
        const path = '$decision_path/decision.json';
        const data = JSON.parse(fs.readFileSync(path, 'utf8'));
        
        data.id = '$full_name';
        data.title = '$(echo $decision_name | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')';
        data.date = '$current_date';
        data.lastUpdated = '$current_date';
        data.provenanceCode.created = '$current_datetime';
        data.provenanceCode.modified = '$current_datetime';
        
        fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
        " 2>/dev/null && echo -e "${GREEN}✅ Updated decision.json${NC}" || echo -e "${YELLOW}⚠️  Could not update decision.json (Node.js required)${NC}"
    fi
    
    # Update prov.jsonld
    if [ -f "$decision_path/prov.jsonld" ]; then
        sed -i.bak "s/decision:template-example-decision/decision:$full_name/g" "$decision_path/prov.jsonld"
        sed -i.bak "s/2026-02-06T10:00:00Z/$current_datetime/g" "$decision_path/prov.jsonld"
        rm -f "$decision_path/prov.jsonld.bak"
        echo -e "${GREEN}✅ Updated prov.jsonld${NC}"
    fi
    
    # Update c2pa.manifest.json
    if [ -f "$decision_path/c2pa.manifest.json" ]; then
        sed -i.bak "s/template-example-decision/$full_name/g" "$decision_path/c2pa.manifest.json"
        sed -i.bak "s/2026-02-06T10:00:00Z/$current_datetime/g" "$decision_path/c2pa.manifest.json"
        sed -i.bak "s/2026-02-06/$current_date/g" "$decision_path/c2pa.manifest.json"
        rm -f "$decision_path/c2pa.manifest.json.bak"
        echo -e "${GREEN}✅ Updated c2pa.manifest.json${NC}"
    fi
    
    # Update decision.md
    if [ -f "$decision_path/decision.md" ]; then
        # Update dates in markdown
        sed -i.bak "s/YYYY-MM-DD/$current_date/g" "$decision_path/decision.md"
        rm -f "$decision_path/decision.md.bak"
        echo -e "${GREEN}✅ Updated decision.md${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}✨ Decision record created successfully!${NC}"
    echo ""
    echo -e "${BLUE}📁 Location:${NC} $decision_path"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "  1. Edit the decision files:"
    echo "     - decision.md (human-readable)"
    echo "     - decision.json (machine-readable)"
    echo "  2. Fill in all sections (context, decision, consequences, etc.)"
    echo "  3. Add evidence to the evidence/ directory if available"
    echo "  4. Validate your decision: ./tools/validate-decision.js $full_name"
    echo "  5. Commit to git: git add $decision_path"
    echo ""
    echo -e "${BLUE}Resources:${NC}"
    echo "  - Decision writing guide: docs/decision-records.md"
    echo "  - Quick start: docs/quickstart.md"
    echo ""
}

# Main script
main() {
    # Check for help flag
    if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
        print_usage
        exit 0
    fi
    
    # Check for list flag
    if [ "$1" = "-l" ] || [ "$1" = "--list" ]; then
        list_decisions
        exit 0
    fi
    
    # Check arguments
    if [ $# -eq 0 ]; then
        echo -e "${RED}❌ Error: Decision name required${NC}"
        echo ""
        print_usage
        exit 1
    fi
    
    # Create decision
    create_decision "$1"
}

main "$@"

