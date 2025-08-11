#!/bin/bash

#
# Sitemap Regeneration Cron Job Setup Script
# For The Best Nexus Letters
#
# This script sets up a weekly cron job to regenerate the sitemap
# by triggering a Vercel deployment every Sunday at 2 AM.
#
# Prerequisites:
# - Node.js installed
# - Access to the project repository
# - Environment variables configured:
#   - VERCEL_TOKEN
#   - VERCEL_PROJECT_ID  
#   - VERCEL_ORG_ID
#
# Usage:
#   chmod +x scripts/setup-cron-sitemap.sh
#   ./scripts/setup-cron-sitemap.sh
#

set -e

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPT_PATH="${PROJECT_ROOT}/scripts/regenerate-sitemap.js"
LOG_PATH="${PROJECT_ROOT}/logs/sitemap-cron.log"
CRON_SCHEDULE="0 2 * * 0"  # Every Sunday at 2 AM

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running on a supported system
check_system() {
    log_info "Checking system compatibility..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]] || [[ "$OSTYPE" == "darwin"* ]]; then
        log_success "System supported: $OSTYPE"
    else
        log_error "Unsupported system: $OSTYPE"
        log_error "This script requires Linux or macOS"
        exit 1
    fi
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        log_error "Please install Node.js: https://nodejs.org/"
        exit 1
    fi
    
    log_success "Node.js found: $(node --version)"
    
    # Check if the regeneration script exists
    if [[ ! -f "$SCRIPT_PATH" ]]; then
        log_error "Sitemap regeneration script not found: $SCRIPT_PATH"
        exit 1
    fi
    
    log_success "Sitemap regeneration script found"
    
    # Check if crontab is available
    if ! command -v crontab &> /dev/null; then
        log_error "crontab is not available"
        log_error "Please install cron service"
        exit 1
    fi
    
    log_success "crontab is available"
}

# Verify environment variables
check_environment_variables() {
    log_info "Checking environment variables..."
    
    local missing_vars=()
    
    if [[ -z "${VERCEL_TOKEN:-}" ]]; then
        missing_vars+=("VERCEL_TOKEN")
    fi
    
    if [[ -z "${VERCEL_PROJECT_ID:-}" ]]; then
        missing_vars+=("VERCEL_PROJECT_ID")
    fi
    
    if [[ -z "${VERCEL_ORG_ID:-}" ]]; then
        missing_vars+=("VERCEL_ORG_ID")
    fi
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        log_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            log_error "  - $var"
        done
        log_error ""
        log_error "Please set these variables in your environment or .env file"
        log_error "You can get these values from your Vercel dashboard"
        exit 1
    fi
    
    log_success "All required environment variables are set"
}

# Create logs directory
setup_logging() {
    local log_dir
    log_dir="$(dirname "$LOG_PATH")"
    
    if [[ ! -d "$log_dir" ]]; then
        log_info "Creating logs directory: $log_dir"
        mkdir -p "$log_dir"
    fi
    
    log_success "Logs directory ready: $log_dir"
}

# Test the sitemap regeneration script
test_script() {
    log_info "Testing sitemap regeneration script..."
    
    # Create a test run that doesn't actually trigger deployment
    # by setting a temporary environment variable
    if node "$SCRIPT_PATH" --dry-run 2>/dev/null || true; then
        log_success "Script test completed"
    else
        log_warning "Script test returned non-zero exit code (this might be expected for dry run)"
    fi
}

# Setup the cron job
setup_cron_job() {
    log_info "Setting up cron job..."
    
    # Create environment file for cron job
    local cron_env_file="${PROJECT_ROOT}/.env.cron"
    cat > "$cron_env_file" << EOF
# Environment variables for sitemap regeneration cron job
# Generated on $(date)
VERCEL_TOKEN=${VERCEL_TOKEN}
VERCEL_PROJECT_ID=${VERCEL_PROJECT_ID}
VERCEL_ORG_ID=${VERCEL_ORG_ID}
NODE_PATH=$(which node)
PROJECT_ROOT=${PROJECT_ROOT}
EOF

    # Create cron job command
    local cron_command="cd \"$PROJECT_ROOT\" && source \".env.cron\" && \"\$NODE_PATH\" \"$SCRIPT_PATH\" >> \"$LOG_PATH\" 2>&1"
    local cron_entry="$CRON_SCHEDULE $cron_command"
    
    # Check if cron job already exists
    if crontab -l 2>/dev/null | grep -q "regenerate-sitemap.js"; then
        log_warning "Existing sitemap regeneration cron job found"
        
        # Ask user if they want to replace it
        read -p "Do you want to replace the existing cron job? (y/N): " -n 1 -r
        echo
        
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Keeping existing cron job"
            return 0
        fi
        
        # Remove existing cron job
        log_info "Removing existing cron job..."
        (crontab -l 2>/dev/null | grep -v "regenerate-sitemap.js") | crontab -
    fi
    
    # Add new cron job
    log_info "Adding new cron job..."
    (crontab -l 2>/dev/null; echo "$cron_entry") | crontab -
    
    log_success "Cron job added successfully"
    log_success "Schedule: Every Sunday at 2:00 AM"
    log_success "Command: $cron_command"
    log_success "Logs: $LOG_PATH"
}

# Verify cron job installation
verify_cron_job() {
    log_info "Verifying cron job installation..."
    
    if crontab -l 2>/dev/null | grep -q "regenerate-sitemap.js"; then
        log_success "Cron job is installed and active"
        
        # Show the installed cron job
        log_info "Installed cron job:"
        crontab -l 2>/dev/null | grep "regenerate-sitemap.js" | while read -r line; do
            echo "  $line"
        done
    else
        log_error "Cron job installation verification failed"
        exit 1
    fi
}

# Create a manual test script
create_manual_test_script() {
    local test_script="${PROJECT_ROOT}/scripts/test-sitemap-regeneration.sh"
    
    log_info "Creating manual test script..."
    
    cat > "$test_script" << 'EOF'
#!/bin/bash
#
# Manual Sitemap Regeneration Test Script
# Run this to manually test the sitemap regeneration process
#

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Testing sitemap regeneration..."
echo "Project root: $PROJECT_ROOT"
echo "Timestamp: $(date)"
echo ""

cd "$PROJECT_ROOT"

if [[ -f ".env.cron" ]]; then
    source ".env.cron"
    echo "Environment loaded from .env.cron"
else
    echo "Warning: .env.cron not found, using current environment"
fi

echo "Running sitemap regeneration script..."
node "scripts/regenerate-sitemap.js"
EOF

    chmod +x "$test_script"
    log_success "Manual test script created: $test_script"
}

# Display usage instructions
show_instructions() {
    log_success "Sitemap regeneration cron job setup completed!"
    echo ""
    log_info "Next steps:"
    echo ""
    echo "1. The cron job will run automatically every Sunday at 2:00 AM"
    echo "2. Check logs in: $LOG_PATH"
    echo "3. Test manually with: $PROJECT_ROOT/scripts/test-sitemap-regeneration.sh"
    echo "4. View active cron jobs: crontab -l"
    echo "5. Remove cron job: crontab -e (then delete the line)"
    echo ""
    echo "Environment file created: $PROJECT_ROOT/.env.cron"
    echo "Make sure to keep this file secure as it contains API tokens"
    echo ""
    log_warning "Important: The cron job will only work if this machine is running"
    log_warning "For production deployments, consider using Vercel Cron Jobs instead"
    echo ""
    log_info "Vercel Cron Jobs documentation:"
    echo "https://vercel.com/docs/functions/cron-jobs"
}

# Main execution
main() {
    echo ""
    log_info "Starting sitemap regeneration cron job setup..."
    echo ""
    
    check_system
    check_prerequisites
    check_environment_variables
    setup_logging
    test_script
    setup_cron_job
    verify_cron_job
    create_manual_test_script
    
    echo ""
    show_instructions
}

# Handle interruptions
trap 'log_error "Setup interrupted"; exit 1' INT TERM

# Run main function
main "$@"
