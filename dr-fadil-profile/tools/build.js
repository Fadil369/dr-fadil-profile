const fs = require('fs').promises;
const path = require('path');

async function buildProject() {
  console.log('🚀 Starting build process...');
  
  try {
    // Create dist directory
    await fs.mkdir('dist', { recursive: true });
    await fs.mkdir('dist/assets/css', { recursive: true });
    await fs.mkdir('dist/assets/js', { recursive: true });
    await fs.mkdir('dist/images', { recursive: true });
    
    // Copy and minify CSS
    const cssContent = await fs.readFile('src/assets/css/main.css', 'utf8');
    const minifiedCSS = cssContent
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Minimize whitespace
      .trim();
    
    await fs.writeFile('dist/assets/css/main.min.css', minifiedCSS);
    
    // Copy and minify JS
    const jsContent = await fs.readFile('src/assets/js/main.js', 'utf8');
    const minifiedJS = jsContent
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\/\/.*$/gm, '') // Remove single-line comments
      .replace(/\s+/g, ' ') // Minimize whitespace
      .trim();
    
    await fs.writeFile('dist/assets/js/main.min.js', minifiedJS);
    
    // Process HTML files
    const htmlFiles = ['index.html'];
    
    for (const htmlFile of htmlFiles) {
      let htmlContent = await fs.readFile(htmlFile, 'utf8');
      
      // Update asset paths to minified versions
      htmlContent = htmlContent
        .replace('src/assets/css/main.css', 'assets/css/main.min.css')
        .replace('src/assets/js/main.js', 'assets/js/main.min.js');
      
      await fs.writeFile(`dist/${htmlFile}`, htmlContent);
    }
    
    console.log('✅ Build process completed successfully');
    console.log('📦 Files generated in dist/ directory');
    
  } catch (error) {
    console.error('❌ Build process failed:', error);
    process.exit(1);
  }
}

buildProject();
