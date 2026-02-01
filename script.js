/**
 * ANTIDDOS.SU - VARIANT B JAVASCRIPT
 * Technical dashboard interactions and data visualization
 */

// =====================================================
// TRAFFIC CHART (Dashboard Preview)
// =====================================================
class TrafficChart {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.dataPoints = [];
        this.maxDataPoints = 50;
        this.animationFrame = null;

        this.init();
    }

    init() {
        this.resize();
        this.generateInitialData();
        this.startAnimation();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    generateInitialData() {
        for (let i = 0; i < this.maxDataPoints; i++) {
            this.dataPoints.push({
                legitimate: Math.random() * 30 + 70, // 70-100 range
                blocked: Math.random() * 20 + 10    // 10-30 range
            });
        }
    }

    updateData() {
        this.dataPoints.shift();
        this.dataPoints.push({
            legitimate: Math.random() * 30 + 70,
            blocked: Math.random() * 20 + 10
        });
    }

    draw() {
        const { width, height } = this.canvas;
        this.ctx.clearRect(0, 0, width, height);

        const pointWidth = width / this.maxDataPoints;
        const maxValue = 100;

        // Draw grid
        this.ctx.strokeStyle = 'rgba(42, 42, 42, 0.5)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = (height / 4) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }

        // Draw blocked traffic (orange)
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#ff6b35';
        this.ctx.lineWidth = 2;
        this.dataPoints.forEach((point, i) => {
            const x = i * pointWidth;
            const y = height - (point.blocked / maxValue) * height;
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        this.ctx.stroke();

        // Fill blocked area
        this.ctx.lineTo(width, height);
        this.ctx.lineTo(0, height);
        this.ctx.closePath();
        this.ctx.fillStyle = 'rgba(255, 107, 53, 0.1)';
        this.ctx.fill();

        // Draw legitimate traffic (cyan)
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#00b8ff';
        this.ctx.lineWidth = 2;
        this.dataPoints.forEach((point, i) => {
            const x = i * pointWidth;
            const y = height - (point.legitimate / maxValue) * height;
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        this.ctx.stroke();

        // Fill legitimate area
        this.ctx.lineTo(width, height);
        this.ctx.lineTo(0, height);
        this.ctx.closePath();
        this.ctx.fillStyle = 'rgba(0, 184, 255, 0.1)';
        this.ctx.fill();
    }

    startAnimation() {
        let lastUpdate = 0;
        const updateInterval = 1000; // Update every second

        const animate = (timestamp) => {
            if (timestamp - lastUpdate >= updateInterval) {
                this.updateData();
                lastUpdate = timestamp;
            }

            this.draw();
            this.animationFrame = requestAnimationFrame(animate);
        };

        this.animationFrame = requestAnimationFrame(animate);
    }

    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

// =====================================================
// COUNTER ANIMATION
// =====================================================
class Counter {
    constructor(element, duration = 2000) {
        this.element = element;
        this.target = parseInt(element.dataset.target) || 0;
        this.duration = duration;
        this.hasAnimated = false;

        if (this.target > 0) {
            this.setupObserver();
        }
    }

    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.animate();
                    this.hasAnimated = true;
                }
            });
        }, { threshold: 0.5 });

        observer.observe(this.element);
    }

    animate() {
        const start = 0;
        const end = this.target;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            const current = Math.floor(start + (end - start) * easeProgress);
            this.element.textContent = this.formatNumber(current);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                this.element.textContent = this.formatNumber(end);
            }
        };

        requestAnimationFrame(updateCounter);
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K';
        }
        return num.toString();
    }
}

// =====================================================
// BAR CHART ANIMATION
// =====================================================
function initBarChartAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.dataset.animate;
                if (targetWidth) {
                    setTimeout(() => {
                        bar.style.width = targetWidth + '%';
                    }, 100);
                    observer.unobserve(bar);
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.bar-fill[data-animate]').forEach(bar => {
        bar.style.width = '0%';
        observer.observe(bar);
    });
}

// =====================================================
// SMOOTH SCROLL
// =====================================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const offsetTop = target.offsetTop - 72;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =====================================================
// COPY TO CLIPBOARD
// =====================================================
function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const textToCopy = btn.dataset.copy;
            if (!textToCopy) return;

            try {
                await navigator.clipboard.writeText(textToCopy);
                showNotification('✓ Copied to clipboard', 'success');

                // Visual feedback
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L6 11L13 4" stroke="currentColor" stroke-width="2"/></svg>';
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                }, 2000);

            } catch (err) {
                showNotification('Failed to copy', 'error');
            }
        });
    });
}

// =====================================================
// FORM HANDLING
// =====================================================
function initFormHandling() {
    const form = document.getElementById('cta-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const domain = document.getElementById('domain').value;
        const email = document.getElementById('email').value;
        const useCase = document.getElementById('use-case').value;

        // Validation
        if (!domain || !email || !useCase) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Invalid email address', 'error');
            return;
        }

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<span>Processing...</span>';
        submitButton.disabled = true;

        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            showNotification('✓ Demo environment created! Check email for API credentials', 'success');
            form.reset();

            // Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'demo_request', {
                    'use_case': useCase,
                    'event_category': 'Conversion'
                });
            }

        } catch (error) {
            showNotification('Error processing request. Contact: hello@antiddos.su', 'error');
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
}

// =====================================================
// NOTIFICATION SYSTEM
// =====================================================
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    Object.assign(notification.style, {
        position: 'fixed',
        top: '90px',
        right: '24px',
        maxWidth: '400px',
        padding: '16px 24px',
        background: type === 'success' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 107, 53, 0.2)',
        border: `1px solid ${type === 'success' ? '#00ff88' : '#ff6b35'}`,
        borderRadius: '8px',
        color: type === 'success' ? '#00ff88' : '#ff6b35',
        fontSize: '13px',
        fontFamily: "'JetBrains Mono', monospace",
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
        zIndex: '10000',
        opacity: '0',
        transform: 'translateX(400px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    });

    document.body.appendChild(notification);

    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// =====================================================
// SCROLL ANIMATIONS
// =====================================================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    const elements = document.querySelectorAll(`
        .tech-layer,
        .benchmark-card,
        .production-card,
        .method-card
    `);

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// =====================================================
// NAV SCROLL EFFECT
// =====================================================
function initNavScroll() {
    const nav = document.querySelector('.nav');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            nav.style.background = 'rgba(10, 10, 10, 0.95)';
            nav.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        } else {
            nav.style.background = 'rgba(10, 10, 10, 0.9)';
            nav.style.boxShadow = 'none';
        }
    });
}

// =====================================================
// ANALYTICS & TRACKING
// =====================================================
function initAnalytics() {
    // Track CTA button clicks
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('click', () => {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cta_click', {
                    'event_category': 'Engagement',
                    'event_label': btn.textContent.trim(),
                    'variant': 'B'
                });
            }
        });
    });

    // Track section visibility
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && typeof gtag !== 'undefined') {
                const sectionId = entry.target.id || 'unnamed';
                gtag('event', 'section_view', {
                    'event_category': 'Engagement',
                    'event_label': sectionId,
                    'variant': 'B'
                });
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('section[id]').forEach(section => {
        sectionObserver.observe(section);
    });

    // Track time on page
    let timeOnPage = 0;
    setInterval(() => {
        timeOnPage += 10;
        if (timeOnPage % 30 === 0 && typeof gtag !== 'undefined') {
            gtag('event', 'timing', {
                'event_category': 'Engagement',
                'event_label': 'Time on Page',
                'value': timeOnPage,
                'variant': 'B'
            });
        }
    }, 10000);
}

// =====================================================
// BENCHMARK DATA TOOLTIPS
// =====================================================
function initBenchmarkTooltips() {
    document.querySelectorAll('.benchmark-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const note = card.querySelector('.benchmark-note');
            if (note) {
                note.style.transform = 'scale(1.05)';
                note.style.background = 'rgba(0, 255, 136, 0.2)';
            }
        });

        card.addEventListener('mouseleave', () => {
            const note = card.querySelector('.benchmark-note');
            if (note) {
                note.style.transform = 'scale(1)';
                note.style.background = 'rgba(0, 255, 136, 0.1)';
            }
        });
    });
}

// =====================================================
// TECHNICAL EASTER EGGS
// =====================================================
function initEasterEggs() {
    // Konami code
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                showNotification('🚀 TURBO MODE ACTIVATED! (Dev console unlocked)', 'success');
                console.log('%c⚡ ANTIDDOS.SU DEBUG MODE', 'color: #00b8ff; font-size: 16px; font-weight: bold;');
                console.log('%ceBPF/XDP Stats:', 'color: #00ff88; font-weight: bold;');
                console.table({
                    'PPS Capacity': '10.2M',
                    'WAF Latency': '2.8ms',
                    'CPU Overhead': '0.003%',
                    'Kernel Response': '50μs'
                });
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    // Console warning for developers
    console.log('%c⚠️ STOP!', 'color: #ff6b35; font-size: 48px; font-weight: bold;');
    console.log('%cThis is a browser feature for developers.', 'color: #b0b8c4; font-size: 14px;');
    console.log('%cIf someone told you to paste code here, it\'s a scam.', 'color: #b0b8c4; font-size: 14px;');
    console.log('%c\nInterested in our tech? We\'re hiring: careers@antiddos.su', 'color: #00b8ff; font-size: 14px; font-weight: bold;');
}

// =====================================================
// PERFORMANCE MONITORING
// =====================================================
function initPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log('%c📊 Page Performance', 'color: #00b8ff; font-size: 14px; font-weight: bold;');
                    console.table({
                        'DOM Load': `${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`,
                        'Page Load': `${perfData.loadEventEnd - perfData.loadEventStart}ms`,
                        'Total Time': `${perfData.loadEventEnd - perfData.fetchStart}ms`
                    });

                    // Send to analytics if slow
                    if (perfData.loadEventEnd - perfData.fetchStart > 3000) {
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'slow_page_load', {
                                'event_category': 'Performance',
                                'value': Math.round(perfData.loadEventEnd - perfData.fetchStart),
                                'variant': 'B'
                            });
                        }
                    }
                }
            }, 0);
        });
    }
}

// =====================================================
// INITIALIZATION
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c⚡ ANTIDDOS.SU - Variant B (Technical)', 'color: #00b8ff; font-size: 18px; font-weight: bold;');
    console.log('%ceBPF/XDP | Rust | Go | React', 'color: #8a95a5; font-size: 12px;');

    // Initialize all components
    const trafficChart = new TrafficChart('traffic-chart');
    initSmoothScroll();
    initCopyButtons();
    initFormHandling();
    initScrollAnimations();
    initBarChartAnimations();
    initNavScroll();
    initBenchmarkTooltips();
    initAnalytics();
    initEasterEggs();
    initPerformanceMonitoring();

    // Initialize counters
    document.querySelectorAll('.stat-value[data-target]').forEach(el => {
        new Counter(el, 2000);
    });

    // Log initialization
    console.log('%c✓ All systems operational', 'color: #00ff88; font-size: 14px;');
    console.log('%cAPI Docs: https://antiddos.su/api/docs', 'color: #00b8ff;');
    console.log('%cGitHub: https://github.com/antiddos-su', 'color: #00b8ff;');
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    // Clean up any running animations or timers
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TrafficChart,
        Counter,
        showNotification
    };
}
