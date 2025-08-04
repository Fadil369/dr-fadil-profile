#!/bin/bash

# Dr. Fadil's Profile - Test Runner Script
# Comprehensive testing suite for the professional healthcare profile

echo "🧪 Dr. Fadil Profile - Test Suite Runner"
echo "========================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js to run automated tests."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

print_success "Node.js is installed: $(node --version)"

# Check if we're in the correct directory
if [ ! -f "index.html" ]; then
    print_error "index.html not found. Please run this script from the project directory."
    exit 1
fi

print_success "Found index.html - in correct directory"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Creating one..."
    # Could recreate package.json here if needed
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
else
    print_success "Dependencies already installed"
fi

# Display menu
echo ""
echo "Test Options:"
echo "1. Run browser-based tests (opens test-suite.html)"
echo "2. Run automated Puppeteer tests"
echo "3. Run both test suites"
echo "4. Quick validation check"
echo ""

read -p "Select option (1-4): " choice

case $choice in
    1)
        print_status "Opening browser-based test suite..."
        if command -v open &> /dev/null; then
            open test-suite.html
        elif command -v xdg-open &> /dev/null; then
            xdg-open test-suite.html
        else
            print_warning "Cannot auto-open browser. Please manually open: test-suite.html"
        fi
        ;;
    2)
        print_status "Running automated Puppeteer tests..."
        node automated-test.js
        ;;
    3)
        print_status "Running comprehensive test suite..."
        echo ""
        print_status "1/2: Starting automated tests..."
        node automated-test.js
        echo ""
        print_status "2/2: Opening browser tests..."
        if command -v open &> /dev/null; then
            open test-suite.html
        elif command -v xdg-open &> /dev/null; then
            xdg-open test-suite.html
        else
            print_warning "Cannot auto-open browser. Please manually open: test-suite.html"
        fi
        ;;
    4)
        print_status "Running quick validation check..."
        echo ""
        
        # Check for critical files
        critical_files=("index.html" "test-suite.html" "automated-test.js")
        for file in "${critical_files[@]}"; do
            if [ -f "$file" ]; then
                print_success "✓ $file exists"
            else
                print_error "✗ $file missing"
            fi
        done
        
        # Check HTML structure
        if grep -q "<!DOCTYPE html>" index.html; then
            print_success "✓ Valid HTML5 doctype"
        else
            print_warning "⚠ HTML5 doctype not found"
        fi
        
        # Check for responsive viewport
        if grep -q "viewport" index.html; then
            print_success "✓ Responsive viewport meta tag found"
        else
            print_warning "⚠ Viewport meta tag not found"
        fi
        
        # Check for key JavaScript functions
        functions=("toggleTheme" "toggleLanguage" "openConsultationModal")
        for func in "${functions[@]}"; do
            if grep -q "$func" index.html; then
                print_success "✓ Function $func found"
            else
                print_warning "⚠ Function $func not found"
            fi
        done
        
        print_status "Quick validation complete!"
        ;;
    *)
        print_error "Invalid option. Please select 1-4."
        exit 1
        ;;
esac

echo ""
print_status "Test execution complete!"

# Check if reports were generated
if [ -f "test-report.html" ]; then
    print_success "HTML test report available: test-report.html"
fi

if [ -f "test-report.json" ]; then
    print_success "JSON test report available: test-report.json"
fi

echo ""
echo "📊 Testing Summary:"
echo "- Browser-based tests: test-suite.html"
echo "- Automated tests: automated-test.js"
echo "- Reports: test-report.html & test-report.json"
echo ""
echo "🔧 Troubleshooting:"
echo "- Ensure index.html is in the same directory"
echo "- For Node.js issues, check: node --version"
echo "- For browser tests, ensure JavaScript is enabled"
echo ""
print_success "Testing suite ready for Dr. Fadil's professional profile!"