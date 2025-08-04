#!/bin/bash

echo "Removing console.log statements..."
find . -name "*.html" -not -path "./node_modules/*" -not -path "./backups/*" | xargs sed -i.bak 's/.*console\.log.*//g'
find . -name "*.js" -not -path "./node_modules/*" -not -path "./backups/*" | xargs sed -i.bak 's/.*console\.log.*//g'

echo "Removing alert statements..."
find . -name "*.html" -not -path "./node_modules/*" -not -path "./backups/*" | xargs sed -i.bak 's/.*alert(.*//g'
find . -name "*.js" -not -path "./node_modules/*" -not -path "./backups/*" | xargs sed -i.bak 's/.*alert(.*//g'

echo "Removing debugger statements..."
find . -name "*.html" -not -path "./node_modules/*" -not -path "./backups/*" | xargs sed -i.bak 's/.*debugger.*//g'
find . -name "*.js" -not -path "./node_modules/*" -not -path "./backups/*" | xargs sed -i.bak 's/.*debugger.*//g'

# Clean up backup files created by sed
find . -name "*.bak" -not -path "./backups/*" -delete

echo "✅ Debug code removal complete"
