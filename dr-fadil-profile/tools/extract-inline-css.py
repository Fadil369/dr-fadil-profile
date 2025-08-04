#!/usr/bin/env python3
import re
import os
from pathlib import Path

def extract_inline_styles(html_file):
    """Extract inline styles from HTML and create external CSS"""
    
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all style attributes
    style_pattern = r'style\s*=\s*["\']([^"\']+)["\']'
    styles = re.findall(style_pattern, content)
    
    # Generate CSS classes
    css_rules = []
    class_counter = 1
    
    updated_content = content
    
    for style in set(styles):  # Remove duplicates
        class_name = f"extracted-style-{class_counter}"
        css_rule = f".{class_name} {{ {style} }}"
        css_rules.append(css_rule)
        
        # Replace inline style with class
        old_pattern = f'style="{style}"'
        new_pattern = f'class="{class_name}"'
        updated_content = updated_content.replace(old_pattern, new_pattern)
        
        # Also handle single quotes
        old_pattern = f"style='{style}'"
        updated_content = updated_content.replace(old_pattern, new_pattern)
        
        class_counter += 1
    
    # Write extracted CSS
    os.makedirs('src/assets/css', exist_ok=True)
    with open('src/assets/css/extracted-styles.css', 'w') as f:
        f.write('/* Extracted inline styles */\n')
        f.write('\n'.join(css_rules))
    
    # Write updated HTML
    backup_file = html_file.replace('.html', '_backup.html')
    os.rename(html_file, backup_file)
    
    with open(html_file, 'w', encoding='utf-8') as f:
        # Add CSS link to head
        if '<head>' in updated_content:
            updated_content = updated_content.replace(
                '<head>',
                '<head>\n    <link rel="stylesheet" href="src/assets/css/extracted-styles.css">'
            )
        f.write(updated_content)
    
    print(f"✅ Extracted {len(styles)} inline styles from {html_file}")
    return len(styles)

# Process HTML files
html_files = ['index.html', 'index_backup.html']
total_extracted = 0

for html_file in html_files:
    if os.path.exists(html_file):
        extracted = extract_inline_styles(html_file)
        total_extracted += extracted

print(f"🎉 Total inline styles extracted: {total_extracted}")
