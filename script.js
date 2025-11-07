// ============================================
// NEON NEXUS - CYBERPUNK JAVASCRIPT
// ============================================

// Global interval IDs for cleanup
const intervals = {
    matrix: null,
    dashboard: null,
    glitch: null,
    time: null,
    cursor: null
};

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initializeEffects();
    initializeKeypad();
    initializeDashboard();
    initializeMatrixRain();
    initializeTypingEffect();
    initializeInteractiveElements();
    setupReducedMotionListener();
    initializeASCIITextEffects();
});

// ============================================
// MATRIX RAIN EFFECT
// ============================================
function initializeMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.1';
    canvas.style.pointerEvents = 'none';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function drawMatrix() {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ffff';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    intervals.matrix = setInterval(drawMatrix, 50);

    // Resize handler with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }, 250);
    });
}

// ============================================
// TYPING EFFECT
// ============================================
function initializeTypingEffect() {
    const tagline = document.querySelector('.tagline');
    if (!tagline) return;
    
    const text = tagline.textContent;
    tagline.textContent = '';
    let index = 0;
    
    function type() {
        if (index < text.length) {
            tagline.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100);
        }
    }
    
    setTimeout(type, 500);
}

// ============================================
// INTERACTIVE KEYPAD
// ============================================
function initializeKeypad() {
    const keys = document.querySelectorAll('.key');
    const display = document.querySelector('.access-display p');
    let code = '';
    const correctCode = '2087';
    
    keys.forEach(key => {
        key.addEventListener('click', function() {
            const value = this.textContent;
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
            
            // Handle input
            if (value === '*') {
                code = '';
                display.innerHTML = 'CLEARANCE LEVEL: <span class="level-badge">SIGMA-7</span>';
            } else if (value === '#') {
                if (code === correctCode) {
                    display.innerHTML = 'ACCESS GRANTED: <span class="level-badge" style="color: #00ff00;">OMEGA-9</span>';
                    playAccessGrantedEffect();
                } else {
                    display.innerHTML = 'ACCESS DENIED: <span class="level-badge" style="color: #ff0040;">INVALID CODE</span>';
                    setTimeout(() => {
                        code = '';
                        display.innerHTML = 'CLEARANCE LEVEL: <span class="level-badge">SIGMA-7</span>';
                    }, 2000);
                }
            } else {
                code += value;
                display.innerHTML = `ENTERED: <span class="level-badge">${'*'.repeat(code.length)}</span>`;
            }
        });
    });
}

function playAccessGrantedEffect() {
    const panel = document.querySelector('.keypad-panel');
    if (!panel) return;
    
    panel.style.borderColor = '#00ff00';
    panel.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.5)';
    
    setTimeout(() => {
        panel.style.borderColor = '';
        panel.style.boxShadow = '';
    }, 3000);
}

// ============================================
// DYNAMIC DASHBOARD
// ============================================
function initializeDashboard() {
    // Animate progress bars
    animateProgressBars();
    
    // Update values periodically
    intervals.dashboard = setInterval(updateDashboardValues, 5000);
    
    // Animate threat items
    animateThreatItems();
}

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.transition = 'width 2s ease-out';
            bar.style.width = width;
        }, 100);
    });
}

function updateDashboardValues() {
    // Update system status
    const gridIntegrity = document.querySelector('.stat-bar:nth-child(1) .stat-value');
    const securityBreach = document.querySelector('.stat-bar:nth-child(2) .stat-value');
    const neuralTraffic = document.querySelector('.stat-bar:nth-child(3) .stat-value');
    
    if (gridIntegrity) {
        const value = Math.floor(Math.random() * 10) + 83;
        gridIntegrity.textContent = value + '%';
        gridIntegrity.previousElementSibling.querySelector('.progress-fill').style.width = value + '%';
    }
    
    if (securityBreach) {
        const value = Math.floor(Math.random() * 20) + 25;
        securityBreach.textContent = value + '%';
        securityBreach.previousElementSibling.querySelector('.progress-fill').style.width = value + '%';
    }
    
    if (neuralTraffic) {
        const value = Math.floor(Math.random() * 8) + 88;
        neuralTraffic.textContent = value + '%';
        neuralTraffic.previousElementSibling.querySelector('.progress-fill').style.width = value + '%';
    }
    
    // Update population metrics with animation
    updateMetricValue('.metric:nth-child(1) .metric-value', ['12.3M', '12.4M', '12.5M']);
    updateMetricValue('.metric:nth-child(2) .metric-value', ['89.1%', '89.3%', '89.5%']);
    updateMetricValue('.metric:nth-child(3) .metric-value', ['46.9K', '47.2K', '47.5K']);
}

function updateMetricValue(selector, values) {
    const element = document.querySelector(selector);
    if (!element) return;
    
    const newValue = values[Math.floor(Math.random() * values.length)];
    element.style.transition = 'opacity 0.3s';
    element.style.opacity = '0';
    
    setTimeout(() => {
        element.textContent = newValue;
        element.style.opacity = '1';
    }, 300);
}

function animateThreatItems() {
    const threats = document.querySelectorAll('.threat-item');
    threats.forEach((threat, index) => {
        threat.style.opacity = '0';
        threat.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            threat.style.transition = 'all 0.5s ease-out';
            threat.style.opacity = '1';
            threat.style.transform = 'translateX(0)';
        }, index * 200);
    });
}

// ============================================
// INTERACTIVE ELEMENTS
// ============================================
function initializeInteractiveElements() {
    // Add click counter to food cards
    const foodCards = document.querySelectorAll('.food-card');
    foodCards.forEach(card => {
        let clickCount = 0;
        card.addEventListener('click', function() {
            clickCount++;
            const price = this.querySelector('.food-price');
            if (price && clickCount === 1) {
                price.style.color = '#00ff00';
                price.textContent = 'ADDED TO CART';
                setTimeout(() => {
                    price.style.color = '';
                    const text = price.textContent;
                    if (text === 'ADDED TO CART') {
                        price.textContent = price.getAttribute('data-original') || text;
                    }
                }, 2000);
            }
        });
        
        // Store original price
        const price = card.querySelector('.food-price');
        if (price) {
            price.setAttribute('data-original', price.textContent);
        }
    });
    
    // Add hover effect to district cards
    const districtCards = document.querySelectorAll('.district-card');
    districtCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Terminal text cursor effect
    const terminalLines = document.querySelectorAll('.terminal-body .terminal-line');
    if (terminalLines.length > 0) {
        const lastLine = terminalLines[terminalLines.length - 1];
        intervals.cursor = setInterval(() => {
            if (lastLine.textContent.endsWith('_')) {
                lastLine.textContent = lastLine.textContent.slice(0, -1);
            } else {
                lastLine.textContent += '_';
            }
        }, 500);
    }
}

// ============================================
// GLITCH EFFECT ENHANCEMENT
// ============================================
function initializeEffects() {
    // Enhanced glitch effect on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const glitchElement = document.querySelector('.glitch');
        
        if (Math.abs(currentScroll - lastScroll) > 100 && glitchElement) {
            glitchElement.style.animation = 'none';
            setTimeout(() => {
                glitchElement.style.animation = '';
            }, 10);
        }
        
        lastScroll = currentScroll;
    });
    
    // Random glitch on sections
    intervals.glitch = setInterval(() => {
        const sections = document.querySelectorAll('.section-title');
        if (sections.length > 0) {
            const randomSection = sections[Math.floor(Math.random() * sections.length)];
            randomSection.style.animation = 'glitch 0.3s';
            setTimeout(() => {
                randomSection.style.animation = '';
            }, 300);
        }
    }, 10000);
}

// ============================================
// EASTER EGG - KONAMI CODE
// ============================================
(function() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    function activateEasterEgg() {
        const body = document.body;
        body.style.filter = 'hue-rotate(180deg)';
        
        const message = document.createElement('div');
        message.style.position = 'fixed';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.background = 'rgba(0, 255, 255, 0.9)';
        message.style.padding = '30px';
        message.style.borderRadius = '10px';
        message.style.fontSize = '24px';
        message.style.color = '#0a0a0f';
        message.style.fontWeight = 'bold';
        message.style.zIndex = '10000';
        message.style.textAlign = 'center';
        message.style.border = '3px solid #ff00ff';
        message.textContent = '🎮 CHEAT CODE ACTIVATED! 🎮\nYou\'re a true netrunner, choom!';
        message.style.whiteSpace = 'pre-line';
        
        body.appendChild(message);
        
        setTimeout(() => {
            body.removeChild(message);
            body.style.filter = '';
        }, 3000);
    }
})();

// ============================================
// TIME DISPLAY
// ============================================
(function() {
    const footer = document.querySelector('.footer-content');
    if (!footer) return;
    
    const timeDisplay = document.createElement('p');
    timeDisplay.style.color = '#00ffff';
    timeDisplay.style.fontFamily = 'monospace';
    timeDisplay.style.fontSize = '0.9rem';
    
    function updateTime() {
        const now = new Date();
        const year = 2087;
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        timeDisplay.textContent = `NEXUS TIME: ${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    
    updateTime();
    intervals.time = setInterval(updateTime, 1000);
    footer.insertBefore(timeDisplay, footer.firstChild);
})();

// ============================================
// RESPONSIVE BEHAVIOR
// ============================================
window.addEventListener('resize', () => {
    // Handle mobile view adjustments
    const canvas = document.getElementById('matrix-canvas');
    if (canvas && window.innerWidth < 768) {
        canvas.style.opacity = '0.05';
    } else if (canvas) {
        canvas.style.opacity = '0.1';
    }
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Setup reduced motion listener
function setupReducedMotionListener() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function handleReducedMotion(e) {
        if (e.matches) {
            disableAnimations();
        } else {
            enableAnimations();
        }
    }
    
    // Check initial state
    handleReducedMotion(mediaQuery);
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleReducedMotion);
}

function disableAnimations() {
    // Disable matrix rain
    const canvas = document.getElementById('matrix-canvas');
    if (canvas) {
        canvas.style.display = 'none';
    }
    
    // Clear all intervals
    if (intervals.matrix) clearInterval(intervals.matrix);
    if (intervals.dashboard) clearInterval(intervals.dashboard);
    if (intervals.glitch) clearInterval(intervals.glitch);
    if (intervals.cursor) clearInterval(intervals.cursor);
}

function enableAnimations() {
    // Re-enable matrix rain
    const canvas = document.getElementById('matrix-canvas');
    if (canvas) {
        canvas.style.display = 'block';
        
        // Restart matrix animation if not already running
        if (!intervals.matrix) {
            const ctx = canvas.getContext('2d');
            const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
            const fontSize = 14;
            const columns = canvas.width / fontSize;
            const drops = Array(Math.floor(columns)).fill(1);
            
            function drawMatrix() {
                ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = '#00ffff';
                ctx.font = fontSize + 'px monospace';
                
                for (let i = 0; i < drops.length; i++) {
                    const text = chars[Math.floor(Math.random() * chars.length)];
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                    
                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
            }
            
            intervals.matrix = setInterval(drawMatrix, 50);
        }
    }
    
    // Restart intervals if they were stopped
    if (!intervals.dashboard) {
        intervals.dashboard = setInterval(updateDashboardValues, 5000);
    }
    if (!intervals.glitch) {
        intervals.glitch = setInterval(() => {
            const sections = document.querySelectorAll('.section-title');
            if (sections.length > 0) {
                const randomSection = sections[Math.floor(Math.random() * sections.length)];
                randomSection.style.animation = 'glitch 0.3s';
                setTimeout(() => {
                    randomSection.style.animation = '';
                }, 300);
            }
        }, 10000);
    }
}

// ============================================
// ASCII TEXT EFFECTS
// ============================================
function initializeASCIITextEffects() {
    // Check if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        return; // Skip ASCII animations if reduced motion is preferred
    }
    
    const sectionTitles = document.querySelectorAll('.section-title');
    
    sectionTitles.forEach((title, index) => {
        const originalText = title.textContent;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-=<>[]{}|/\\';
        let currentInterval = null;
        
        // Add hover effect for ASCII scramble
        title.addEventListener('mouseenter', function() {
            // Clear any existing interval
            if (currentInterval) {
                clearInterval(currentInterval);
            }
            
            let iterations = 0;
            const maxIterations = originalText.length;
            
            currentInterval = setInterval(() => {
                title.textContent = originalText
                    .split('')
                    .map((char, idx) => {
                        if (idx < iterations) {
                            return originalText[idx];
                        }
                        if (char === ' ') return ' ';
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');
                
                iterations += 1/3;
                
                if (iterations >= maxIterations) {
                    clearInterval(currentInterval);
                    currentInterval = null;
                    title.textContent = originalText;
                }
            }, 30);
        });
        
        // Clear interval on mouseleave
        title.addEventListener('mouseleave', function() {
            if (currentInterval) {
                clearInterval(currentInterval);
                currentInterval = null;
                title.textContent = originalText;
            }
        });
        
        // Staggered reveal animation on page load
        setTimeout(() => {
            let iterations = 0;
            const revealInterval = setInterval(() => {
                title.textContent = originalText
                    .split('')
                    .map((char, idx) => {
                        if (idx < iterations) {
                            return originalText[idx];
                        }
                        if (char === ' ' || char === '/' || char === '.') return char;
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');
                
                iterations += 0.5;
                
                if (iterations >= originalText.length) {
                    clearInterval(revealInterval);
                    title.textContent = originalText;
                }
            }, 50);
        }, index * 200);
    });
}
