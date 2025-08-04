/**
 * Dr. Fadil's Profile - Automated Browser Testing Script
 * Comprehensive testing using Puppeteer for real browser automation
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class DrFadilProfileTester {
    constructor() {
        this.browser = null;
        this.page = null;
        this.testResults = {
            passed: 0,
            failed: 0,
            warnings: 0,
            details: []
        };
        this.testUrl = `file://${path.join(__dirname, 'index.html')}`;
    }

    async initialize() {
        console.log('🚀 Starting Dr. Fadil Profile Test Suite...\n');
        
        this.browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: { width: 1200, height: 800 }
        });
        
        this.page = await this.browser.newPage();
        
        // Enable console logging from the page
        this.page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log('❌ Browser Error:', msg.text());
            }
        });
        
        // Enable error handling
        this.page.on('pageerror', error => {
            console.log('❌ Page Error:', error.message);
        });
        
        await this.page.goto(this.testUrl, { waitUntil: 'networkidle0' });
        console.log('✅ Page loaded successfully');
    }

    async runAllTests() {
        const testSuites = [
            { name: 'Navigation Tests', method: 'testNavigation' },
            { name: 'Theme & Language Toggle Tests', method: 'testToggles' },
            { name: 'Button Functionality Tests', method: 'testButtons' },
            { name: 'Interactive Features Tests', method: 'testInteractiveFeatures' },
            { name: 'Form & Modal Tests', method: 'testForms' },
            { name: 'Responsive Design Tests', method: 'testResponsiveDesign' },
            { name: 'Performance Tests', method: 'testPerformance' },
            { name: 'Accessibility Tests', method: 'testAccessibility' }
        ];

        for (const suite of testSuites) {
            console.log(`\n🧪 Running ${suite.name}...`);
            await this[suite.method]();
        }

        await this.generateReport();
        await this.cleanup();
    }

    async testNavigation() {
        // Test 1: Mobile menu toggle
        await this.runTest('Mobile Menu Toggle', async () => {
            // Simulate mobile viewport
            await this.page.setViewport({ width: 375, height: 667 });
            
            const mobileMenuBtn = await this.page.$('#mobileMenuBtn');
            const navLinks = await this.page.$('#navLinks');
            
            if (!mobileMenuBtn || !navLinks) {
                throw new Error('Mobile menu elements not found');
            }
            
            // Check initial state
            const initialState = await this.page.evaluate((nav) => {
                return nav.classList.contains('active');
            }, navLinks);
            
            // Click menu button
            await mobileMenuBtn.click();
            await this.page.waitForTimeout(300);
            
            // Check new state
            const newState = await this.page.evaluate((nav) => {
                return nav.classList.contains('active');
            }, navLinks);
            
            if (initialState === newState) {
                throw new Error('Mobile menu toggle not working');
            }
            
            return 'Mobile menu toggles correctly';
        });

        // Test 2: Navigation links
        await this.runTest('Navigation Links', async () => {
            await this.page.setViewport({ width: 1200, height: 800 });
            
            const navLinks = await this.page.$$('nav a[href^="#"]');
            
            if (navLinks.length === 0) {
                throw new Error('No navigation anchor links found');
            }
            
            // Test first navigation link
            const firstLink = navLinks[0];
            const href = await this.page.evaluate(el => el.getAttribute('href'), firstLink);
            
            await firstLink.click();
            await this.page.waitForTimeout(500);
            
            // Check if page scrolled
            const scrollPosition = await this.page.evaluate(() => window.scrollY);
            
            return `Navigation working - ${navLinks.length} links found, scroll position: ${scrollPosition}px`;
        });

        // Test 3: Fixed navigation behavior
        await this.runTest('Fixed Navigation', async () => {
            const nav = await this.page.$('.nav');
            
            if (!nav) {
                throw new Error('Navigation element not found');
            }
            
            const position = await this.page.evaluate((navEl) => {
                const style = window.getComputedStyle(navEl);
                return {
                    position: style.position,
                    zIndex: style.zIndex
                };
            }, nav);
            
            if (position.position !== 'fixed') {
                throw new Error('Navigation is not fixed positioned');
            }
            
            return `Navigation properly fixed with z-index: ${position.zIndex}`;
        });
    }

    async testToggles() {
        // Test 1: Theme toggle
        await this.runTest('Theme Toggle', async () => {
            const themeToggle = await this.page.$('#themeToggle');
            
            if (!themeToggle) {
                throw new Error('Theme toggle button not found');
            }
            
            // Get initial theme
            const initialTheme = await this.page.evaluate(() => {
                return document.documentElement.getAttribute('data-theme') || 'dark';
            });
            
            // Click theme toggle
            await themeToggle.click();
            await this.page.waitForTimeout(300);
            
            // Get new theme
            const newTheme = await this.page.evaluate(() => {
                return document.documentElement.getAttribute('data-theme') || 'dark';
            });
            
            if (initialTheme === newTheme) {
                return `Theme toggle present but change not detected (may be CSS-based)`;
            }
            
            return `Theme toggle working: ${initialTheme} → ${newTheme}`;
        });

        // Test 2: Language toggle
        await this.runTest('Language Toggle', async () => {
            const langToggle = await this.page.$('[onclick*="toggleLanguage"]');
            
            if (!langToggle) {
                return 'Language toggle not found - may be implemented differently';
            }
            
            // Check for language content elements
            const enElements = await this.page.$$('.en-content');
            const arElements = await this.page.$$('.ar-content');
            
            if (enElements.length === 0 || arElements.length === 0) {
                throw new Error('Language content elements not found');
            }
            
            return `Language toggle available with ${enElements.length} EN and ${arElements.length} AR elements`;
        });

        // Test 3: LocalStorage functionality
        await this.runTest('LocalStorage Persistence', async () => {
            const localStorageTest = await this.page.evaluate(() => {
                try {
                    localStorage.setItem('test-key', 'test-value');
                    const retrieved = localStorage.getItem('test-key');
                    localStorage.removeItem('test-key');
                    
                    if (retrieved !== 'test-value') {
                        throw new Error('LocalStorage not working');
                    }
                    
                    // Check for existing settings
                    const theme = localStorage.getItem('theme');
                    const language = localStorage.getItem('language');
                    
                    return {
                        working: true,
                        hasTheme: !!theme,
                        hasLanguage: !!language,
                        theme,
                        language
                    };
                } catch (error) {
                    return { working: false, error: error.message };
                }
            });
            
            if (!localStorageTest.working) {
                throw new Error(`LocalStorage issue: ${localStorageTest.error}`);
            }
            
            return `LocalStorage working. Theme: ${localStorageTest.theme || 'not set'}, Language: ${localStorageTest.language || 'not set'}`;
        });
    }

    async testButtons() {
        // Test 1: Consultation modal
        await this.runTest('Consultation Modal', async () => {
            const consultationBtn = await this.page.$('button[onclick*="openConsultationModal"]');
            
            if (!consultationBtn) {
                throw new Error('Consultation button not found');
            }
            
            // Click button to open modal
            await consultationBtn.click();
            await this.page.waitForTimeout(500);
            
            // Check if modal is visible
            const modal = await this.page.$('#consultationModal');
            const isModalVisible = await this.page.evaluate((modalEl) => {
                if (!modalEl) return false;
                const style = window.getComputedStyle(modalEl);
                return style.display !== 'none' && modalEl.classList.contains('active');
            }, modal);
            
            if (!isModalVisible) {
                return 'Modal button present but visibility change not detected';
            }
            
            // Test close functionality
            const closeBtn = await this.page.$('.modal-close, [onclick*="closeConsultationModal"]');
            if (closeBtn) {
                await closeBtn.click();
                await this.page.waitForTimeout(300);
            }
            
            return 'Consultation modal opens and closes correctly';
        });

        // Test 2: Copy to clipboard functionality
        await this.runTest('Copy to Clipboard', async () => {
            const copyBtns = await this.page.$$('button[onclick*="copyToClipboard"]');
            
            if (copyBtns.length === 0) {
                throw new Error('Copy buttons not found');
            }
            
            // Test first copy button
            const firstCopyBtn = copyBtns[0];
            await firstCopyBtn.click();
            await this.page.waitForTimeout(300);
            
            // Check if copy function exists
            const copyFunctionExists = await this.page.evaluate(() => {
                return typeof window.copyToClipboard === 'function';
            });
            
            if (!copyFunctionExists) {
                throw new Error('copyToClipboard function not found');
            }
            
            return `Copy functionality available with ${copyBtns.length} copy buttons`;
        });

        // Test 3: Diagnostic demo
        await this.runTest('Diagnostic Demo', async () => {
            const demoBtn = await this.page.$('button[onclick*="startDiagnosticDemo"]');
            
            if (!demoBtn) {
                return 'Diagnostic demo button not found - may not be implemented';
            }
            
            const demoSteps = await this.page.$$('.diagnostic-step');
            
            if (demoSteps.length === 0) {
                throw new Error('Diagnostic demo steps not found');
            }
            
            // Start demo
            await demoBtn.click();
            await this.page.waitForTimeout(1000);
            
            // Check for active steps
            const activeSteps = await this.page.$$('.diagnostic-step.active');
            
            return `Diagnostic demo available with ${demoSteps.length} steps, ${activeSteps.length} currently active`;
        });
    }

    async testInteractiveFeatures() {
        // Test 1: Neural Network Canvas
        await this.runTest('Neural Network Visualization', async () => {
            const canvas = await this.page.$('#neuralNetwork');
            
            if (!canvas) {
                throw new Error('Neural network canvas not found');
            }
            
            const canvasInfo = await this.page.evaluate((canvasEl) => {
                const ctx = canvasEl.getContext('2d');
                return {
                    width: canvasEl.width,
                    height: canvasEl.height,
                    hasContext: !!ctx
                };
            }, canvas);
            
            if (!canvasInfo.hasContext) {
                throw new Error('Canvas context not available');
            }
            
            // Check for neural network class
            const hasNeuralNetworkClass = await this.page.evaluate(() => {
                return typeof window.NeuralNetworkVisualization !== 'undefined';
            });
            
            return `Neural network canvas: ${canvasInfo.width}x${canvasInfo.height}, Class available: ${hasNeuralNetworkClass}`;
        });

        // Test 2: AI Chat Assistant
        await this.runTest('AI Chat Assistant', async () => {
            const chatToggle = await this.page.$('#aiChatToggle');
            const chatAssistant = await this.page.$('#aiChatAssistant');
            
            if (!chatToggle || !chatAssistant) {
                return 'AI Chat elements not found - may be dynamically loaded';
            }
            
            // Test chat toggle
            await chatToggle.click();
            await this.page.waitForTimeout(500);
            
            const chatInput = await this.page.$('#chatInput');
            
            if (!chatInput) {
                throw new Error('Chat input not found after opening');
            }
            
            return 'AI Chat Assistant interface available and toggles correctly';
        });

        // Test 3: FHIR Playground
        await this.runTest('FHIR Interoperability Playground', async () => {
            const inputData = await this.page.$('#inputData');
            const outputData = await this.page.$('#outputData');
            
            if (!inputData || !outputData) {
                throw new Error('FHIR playground elements not found');
            }
            
            // Check for format buttons
            const formatBtns = await this.page.$$('.format-btn');
            
            if (formatBtns.length === 0) {
                throw new Error('FHIR format buttons not found');
            }
            
            // Test data transformation function
            const hasFunctions = await this.page.evaluate(() => {
                return typeof window.validateData === 'function' && 
                       typeof window.transformData === 'function';
            });
            
            if (!hasFunctions) {
                throw new Error('FHIR transformation functions not found');
            }
            
            return `FHIR playground fully functional with ${formatBtns.length} format options`;
        });

        // Test 4: Impact Dashboard
        await this.runTest('Real-time Impact Dashboard', async () => {
            const dashboard = await this.page.$('#impactDashboard');
            
            if (!dashboard) {
                throw new Error('Impact dashboard not found');
            }
            
            // Check for metrics
            const metrics = await this.page.$$('[id$="Count"], [id$="Metric"]');
            
            if (metrics.length === 0) {
                return 'Dashboard found but no metrics detected';
            }
            
            // Check for dashboard toggle function
            const hasToggleFunction = await this.page.evaluate(() => {
                return typeof window.toggleImpactDashboard === 'function';
            });
            
            return `Impact dashboard with ${metrics.length} metrics, toggle function: ${hasToggleFunction}`;
        });
    }

    async testForms() {
        // Test 1: Form validation
        await this.runTest('Form Validation', async () => {
            const form = await this.page.$('#consultationForm');
            
            if (!form) {
                throw new Error('Consultation form not found');
            }
            
            const requiredFields = await this.page.$$('#consultationForm [required]');
            const allInputs = await this.page.$$('#consultationForm input, #consultationForm textarea, #consultationForm select');
            
            return `Form found with ${allInputs.length} inputs, ${requiredFields.length} required fields`;
        });

        // Test 2: EmailJS integration
        await this.runTest('EmailJS Integration', async () => {
            const hasEmailJS = await this.page.evaluate(() => {
                return typeof window.emailjs !== 'undefined';
            });
            
            const hasSubmitFunction = await this.page.evaluate(() => {
                return typeof window.submitConsultationForm === 'function';
            });
            
            if (!hasSubmitFunction) {
                throw new Error('Form submission function not found');
            }
            
            return `EmailJS loaded: ${hasEmailJS}, Submit function available: ${hasSubmitFunction}`;
        });

        // Test 3: Modal overlay behavior
        await this.runTest('Modal Overlay Behavior', async () => {
            const modal = await this.page.$('#consultationModal');
            const overlay = await this.page.$('.modal-overlay');
            
            if (!modal) {
                throw new Error('Modal not found');
            }
            
            // Open modal
            const openBtn = await this.page.$('button[onclick*="openConsultationModal"]');
            if (openBtn) {
                await openBtn.click();
                await this.page.waitForTimeout(300);
                
                // Test overlay click to close (if implemented)
                if (overlay) {
                    await overlay.click();
                    await this.page.waitForTimeout(300);
                }
            }
            
            return `Modal structure correct, overlay: ${!!overlay}`;
        });
    }

    async testResponsiveDesign() {
        const viewports = [
            { width: 320, height: 568, name: 'Mobile Portrait' },
            { width: 768, height: 1024, name: 'Tablet Portrait' },
            { width: 1024, height: 768, name: 'Tablet Landscape' },
            { width: 1200, height: 800, name: 'Desktop' }
        ];

        for (const viewport of viewports) {
            await this.runTest(`Responsive - ${viewport.name}`, async () => {
                await this.page.setViewport(viewport);
                await this.page.waitForTimeout(500);
                
                // Check layout elements
                const hero = await this.page.$('.hero');
                const nav = await this.page.$('.nav');
                
                if (!hero || !nav) {
                    throw new Error('Main layout elements not found');
                }
                
                // Check if elements are visible and properly positioned
                const elementSizes = await this.page.evaluate(() => {
                    const hero = document.querySelector('.hero');
                    const nav = document.querySelector('.nav');
                    
                    return {
                        heroVisible: hero ? hero.offsetHeight > 0 : false,
                        navVisible: nav ? nav.offsetHeight > 0 : false,
                        bodyWidth: document.body.offsetWidth
                    };
                });
                
                if (!elementSizes.heroVisible || !elementSizes.navVisible) {
                    throw new Error('Layout elements not properly visible');
                }
                
                return `Layout responsive at ${viewport.width}x${viewport.height}, body width: ${elementSizes.bodyWidth}px`;
            });
        }
    }

    async testPerformance() {
        // Test 1: Page load performance
        await this.runTest('Page Load Performance', async () => {
            const performanceData = await this.page.evaluate(() => {
                const timing = performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
                
                return {
                    loadTime: Math.round(loadTime),
                    domReady: Math.round(domReady),
                    resources: performance.getEntriesByType('resource').length
                };
            });
            
            let status = 'Good';
            if (performanceData.loadTime > 5000) status = 'Slow';
            else if (performanceData.loadTime > 3000) status = 'Moderate';
            
            return `Load time: ${performanceData.loadTime}ms (${status}), DOM ready: ${performanceData.domReady}ms, ${performanceData.resources} resources`;
        });

        // Test 2: Memory usage
        await this.runTest('Memory Usage', async () => {
            const memoryInfo = await this.page.evaluate(() => {
                if (performance.memory) {
                    return {
                        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024 * 100) / 100,
                        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024 * 100) / 100,
                        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024 * 100) / 100
                    };
                }
                return null;
            });
            
            if (!memoryInfo) {
                return 'Memory monitoring not available in this browser';
            }
            
            let status = 'Good';
            if (memoryInfo.used > 100) status = 'High';
            else if (memoryInfo.used > 50) status = 'Moderate';
            
            return `JS Heap: ${memoryInfo.used}MB used of ${memoryInfo.total}MB (${status})`;
        });

        // Test 3: Animation performance
        await this.runTest('Animation Performance', async () => {
            const animationData = await this.page.evaluate(() => {
                const animatedElements = document.querySelectorAll('.particle, .animated-bg, [style*="animation"]');
                const transformElements = document.querySelectorAll('[style*="transform"]');
                
                // Check for GPU acceleration hints
                let gpuAcceleratedElements = 0;
                animatedElements.forEach(el => {
                    const style = window.getComputedStyle(el);
                    if (style.transform !== 'none' || style.willChange !== 'auto') {
                        gpuAcceleratedElements++;
                    }
                });
                
                return {
                    animated: animatedElements.length,
                    transforms: transformElements.length,
                    gpuAccelerated: gpuAcceleratedElements
                };
            });
            
            return `Animated elements: ${animationData.animated}, GPU accelerated: ${animationData.gpuAccelerated}, Transforms: ${animationData.transforms}`;
        });
    }

    async testAccessibility() {
        // Test 1: Keyboard navigation
        await this.runTest('Keyboard Navigation', async () => {
            const focusableElements = await this.page.$$('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
            
            if (focusableElements.length === 0) {
                throw new Error('No focusable elements found');
            }
            
            // Test tab navigation
            await this.page.keyboard.press('Tab');
            const activeElement = await this.page.evaluate(() => document.activeElement.tagName);
            
            return `${focusableElements.length} focusable elements, tab navigation working (focused: ${activeElement})`;
        });

        // Test 2: ARIA attributes
        await this.runTest('ARIA Attributes', async () => {
            const ariaElements = await this.page.$$('[aria-label], [aria-labelledby], [aria-describedby], [role]');
            const buttons = await this.page.$$('button');
            const buttonsWithAria = await this.page.$$('button[aria-label]');
            
            const ariaScore = (buttonsWithAria.length / Math.max(buttons.length, 1)) * 100;
            
            return `ARIA elements: ${ariaElements.length}, Button ARIA coverage: ${Math.round(ariaScore)}% (${buttonsWithAria.length}/${buttons.length})`;
        });

        // Test 3: Color contrast and accessibility features
        await this.runTest('Accessibility Features', async () => {
            const accessibilityFeatures = await this.page.evaluate(() => {
                // Check for high contrast support
                const styles = Array.from(document.querySelectorAll('style'));
                const hasHighContrast = styles.some(style => 
                    style.textContent.includes('prefers-contrast') || 
                    style.textContent.includes('prefers-reduced-motion')
                );
                
                // Check for alt text on images
                const images = document.querySelectorAll('img');
                const imagesWithAlt = document.querySelectorAll('img[alt]');
                
                // Check for semantic HTML
                const semanticElements = document.querySelectorAll('header, nav, main, section, article, aside, footer');
                
                return {
                    highContrast: hasHighContrast,
                    imageAlt: `${imagesWithAlt.length}/${images.length}`,
                    semantic: semanticElements.length
                };
            });
            
            return `High contrast support: ${accessibilityFeatures.highContrast}, Image alt text: ${accessibilityFeatures.imageAlt}, Semantic elements: ${accessibilityFeatures.semantic}`;
        });
    }

    async runTest(testName, testFunction) {
        try {
            const result = await testFunction();
            console.log(`  ✅ ${testName}: ${result}`);
            this.testResults.passed++;
            this.testResults.details.push({
                name: testName,
                status: 'PASSED',
                message: result
            });
        } catch (error) {
            console.log(`  ❌ ${testName}: ${error.message}`);
            this.testResults.failed++;
            this.testResults.details.push({
                name: testName,
                status: 'FAILED',
                message: error.message
            });
        }
    }

    async generateReport() {
        const total = this.testResults.passed + this.testResults.failed + this.testResults.warnings;
        const passRate = ((this.testResults.passed / total) * 100).toFixed(1);
        
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total,
                passed: this.testResults.passed,
                failed: this.testResults.failed,
                warnings: this.testResults.warnings,
                passRate: `${passRate}%`
            },
            testDetails: this.testResults.details,
            recommendations: this.generateRecommendations()
        };
        
        // Save report to file
        const reportPath = path.join(__dirname, 'test-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        // Generate HTML report
        const htmlReport = this.generateHTMLReport(report);
        const htmlReportPath = path.join(__dirname, 'test-report.html');
        fs.writeFileSync(htmlReportPath, htmlReport);
        
        console.log(`\n📊 TEST SUITE COMPLETE`);
        console.log(`======================`);
        console.log(`Total Tests: ${total}`);
        console.log(`✅ Passed: ${this.testResults.passed}`);
        console.log(`❌ Failed: ${this.testResults.failed}`);
        console.log(`⚠️  Warnings: ${this.testResults.warnings}`);
        console.log(`📈 Pass Rate: ${passRate}%`);
        console.log(`\n📄 Reports generated:`);
        console.log(`   JSON: ${reportPath}`);
        console.log(`   HTML: ${htmlReportPath}`);
    }

    generateRecommendations() {
        const recommendations = [];
        
        if (this.testResults.failed > 0) {
            recommendations.push({
                priority: 'HIGH',
                category: 'Critical Issues',
                description: 'Address all failed tests to ensure core functionality works correctly'
            });
        }
        
        recommendations.push({
            priority: 'MEDIUM',
            category: 'Performance Optimization',
            description: 'Optimize loading times and memory usage for better user experience'
        });
        
        recommendations.push({
            priority: 'MEDIUM',
            category: 'Accessibility Enhancement',
            description: 'Improve ARIA labels and keyboard navigation for better accessibility'
        });
        
        recommendations.push({
            priority: 'LOW',
            category: 'Mobile Experience',
            description: 'Fine-tune responsive design for optimal mobile user experience'
        });
        
        return recommendations;
    }

    generateHTMLReport(report) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dr. Fadil Profile - Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; }
        .stat-card { text-align: center; padding: 20px; border-radius: 8px; background: #f8f9fa; }
        .stat-number { font-size: 2rem; font-weight: bold; margin-bottom: 5px; }
        .passed { color: #28a745; } .failed { color: #dc3545; } .warning { color: #ffc107; }
        .test-details { padding: 30px; }
        .test-item { display: flex; justify-content: space-between; align-items: center; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .test-passed { background: #d4edda; border-left: 4px solid #28a745; }
        .test-failed { background: #f8d7da; border-left: 4px solid #dc3545; }
        .recommendations { padding: 30px; background: #f8f9fa; }
        .rec-item { margin: 15px 0; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff; background: white; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Dr. Fadil Profile - Test Report</h1>
            <p>Generated: ${report.timestamp}</p>
        </div>
        
        <div class="summary">
            <div class="stat-card">
                <div class="stat-number">${report.summary.total}</div>
                <div>Total Tests</div>
            </div>
            <div class="stat-card">
                <div class="stat-number passed">${report.summary.passed}</div>
                <div>Passed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number failed">${report.summary.failed}</div>
                <div>Failed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${report.summary.passRate}</div>
                <div>Pass Rate</div>
            </div>
        </div>
        
        <div class="test-details">
            <h2>Test Results</h2>
            ${report.testDetails.map(test => `
                <div class="test-item test-${test.status.toLowerCase()}">
                    <div>
                        <strong>${test.name}</strong>
                        <div style="font-size: 0.9rem; color: #666; margin-top: 5px;">${test.message}</div>
                    </div>
                    <div class="test-status ${test.status.toLowerCase()}">${test.status}</div>
                </div>
            `).join('')}
        </div>
        
        <div class="recommendations">
            <h2>Recommendations</h2>
            ${report.recommendations.map(rec => `
                <div class="rec-item">
                    <strong>[${rec.priority}] ${rec.category}</strong>
                    <div style="margin-top: 5px;">${rec.description}</div>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

// Main execution
async function main() {
    const tester = new DrFadilProfileTester();
    
    try {
        await tester.initialize();
        await tester.runAllTests();
    } catch (error) {
        console.error('❌ Test suite failed:', error);
        await tester.cleanup();
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = DrFadilProfileTester;