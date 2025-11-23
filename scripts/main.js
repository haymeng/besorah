// ===================================
// BESORAH YESHUA MINISTRY - MAIN JAVASCRIPT
// Complete Fixed & Optimized Version
// Version: 2.0
// ===================================

'use strict';

// ===================================
// PERFORMANCE MONITORING
// ===================================
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page loaded in ${pageLoadTime}ms`);
    });
}

// ===================================
// ERROR TRACKING
// ===================================
class ErrorTracker {
    constructor() {
        this.errors = [];
        this.setupListeners();
    }
    
    setupListeners() {
        window.addEventListener('error', (e) => this.logError(e));
        window.addEventListener('unhandledrejection', (e) => this.logError(e));
    }
    
    logError(error) {
        const errorData = {
            message: error.message || error.reason,
            stack: error.error?.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        this.errors.push(errorData);
        console.error('Error logged:', errorData);
        
        // Show user-friendly message
        this.showErrorToUser();
    }
    
    showErrorToUser() {
        // Only show if not already showing
        if (document.querySelector('.error-notification')) return;
        
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <div style="position: fixed; top: 80px; right: 20px; background: #dc2626; color: white; padding: 1rem 1.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 9999; max-width: 300px;">
                <strong>⚠️ Something went wrong</strong>
                <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">Please refresh the page and try again.</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

const errorTracker = new ErrorTracker();

// ===================================
// FORM VALIDATOR CLASS
// ===================================
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;
        this.errors = [];
    }
    
    validate() {
        this.errors = [];
        const requiredFields = this.form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.addError(field, `${field.labels[0]?.textContent || 'This field'} is required`);
            }
        });
        
        return this.errors.length === 0;
    }
    
    addError(field, message) {
        this.errors.push({ field, message });
        this.showFieldError(field, message);
    }
    
    showFieldError(field, message) {
        // Remove existing error
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) existingError.remove();
        
        // Add new error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error text-red-600 text-sm mt-1';
        errorDiv.setAttribute('role', 'alert');
        errorDiv.textContent = message;
        field.parentElement.appendChild(errorDiv);
        field.classList.add('border-red-500');
    }
    
    clearErrors() {
        this.form.querySelectorAll('.field-error').forEach(el => el.remove());
        this.form.querySelectorAll('.border-red-500').forEach(el => {
            el.classList.remove('border-red-500');
        });
    }
}

// ===================================
// MOBILE NAVIGATION
// ===================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    // Toggle menu
    hamburger.addEventListener('click', () => {
        const isActive = hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Update ARIA attribute for accessibility
        hamburger.setAttribute('aria-expanded', isActive);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            if (hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================
let lastScroll = 0;
const header = document.querySelector('header');

if (header) {
    window.addEventListener('scroll', throttle(function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, 100));
}

// ===================================
// ACTIVE NAVIGATION
// ===================================
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        link.classList.remove('active');
        
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === 'index.html' && linkHref === 'index.html')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

// ===================================
// SMOOTH SCROLLING
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Don't prevent default for just "#" links
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// EVENTS PAGE - FILTERING
// ===================================
const filterButtons = document.querySelectorAll('.filter-btn');
const eventCards = document.querySelectorAll('.event-card');

if (filterButtons.length > 0 && eventCards.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            // Filter events with animation
            eventCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.setAttribute('aria-hidden', 'false');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    card.setAttribute('aria-hidden', 'true');
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===================================
// DONATION PAGE - AMOUNT SELECTION
// ===================================
const amountButtons = document.querySelectorAll('.amount-btn');
const customAmountInput = document.querySelector('.custom-amount-input');
const customAmountField = document.getElementById('customAmount');
const displayAmount = document.getElementById('displayAmount');

if (amountButtons.length > 0) {
    amountButtons.forEach(button => {
        button.addEventListener('click', function() {
            const amount = this.getAttribute('data-amount');
            
            // Remove active class from all buttons
            amountButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            // Handle custom amount
            if (amount === 'custom') {
                if (customAmountInput) {
                    customAmountInput.style.display = 'block';
                    if (customAmountField) {
                        customAmountField.focus();
                        updateDisplayAmount(customAmountField.value || 100);
                    }
                }
            } else {
                if (customAmountInput) {
                    customAmountInput.style.display = 'none';
                }
                updateDisplayAmount(amount);
            }
        });
    });
    
    // Handle custom amount input
    if (customAmountField) {
        customAmountField.addEventListener('input', function() {
            const value = parseFloat(this.value) || 0;
            amountButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            const customBtn = document.querySelector('[data-amount="custom"]');
            if (customBtn && value > 0) {
                customBtn.classList.add('active');
                customBtn.setAttribute('aria-pressed', 'true');
                updateDisplayAmount(value);
            }
        });
    }
}

// Update display amount helper function
function updateDisplayAmount(amount) {
    if (displayAmount) {
        const numAmount = parseFloat(amount) || 0;
        displayAmount.textContent = formatCurrency(numAmount);
    }
}

// Frequency buttons
const frequencyButtons = document.querySelectorAll('.frequency-btn');
if (frequencyButtons.length > 0) {
    frequencyButtons.forEach(button => {
        button.addEventListener('click', function() {
            frequencyButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
        });
    });
}

// Payment method buttons
const paymentButtons = document.querySelectorAll('.payment-btn');
const paymentSections = document.querySelectorAll('.payment-section');

if (paymentButtons.length > 0) {
    paymentButtons.forEach(button => {
        button.addEventListener('click', function() {
            const method = this.getAttribute('data-method');
            
            // Update active button
            paymentButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            // Show corresponding payment section
            paymentSections.forEach(section => {
                section.style.display = 'none';
                section.setAttribute('aria-hidden', 'true');
            });
            
            const targetSection = document.querySelector(`.${method}-section`);
            if (targetSection) {
                targetSection.style.display = 'block';
                targetSection.setAttribute('aria-hidden', 'false');
            }
        });
    });
}

// ===================================
// CONTACT FORM HANDLING (NETLIFY FORMS)
// ===================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    // Initialize validator
    const validator = new FormValidator('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        validator.clearErrors();
        
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        
        let isValid = true;
        let errorMessage = '';
        
        // Validate name
        if (name && !name.value.trim()) {
            isValid = false;
            errorMessage = 'Please enter your name.';
            validator.addError(name, errorMessage);
        }
        
        // Validate email
        if (email && !email.value.trim()) {
            isValid = false;
            errorMessage = 'Please enter your email address.';
            validator.addError(email, errorMessage);
        } else if (email && !isValidEmail(email.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
            validator.addError(email, errorMessage);
        }
        
        // Validate message
        if (message && !message.value.trim()) {
            isValid = false;
            errorMessage = 'Please enter a message.';
            validator.addError(message, errorMessage);
        }
        
        // Check honeypot field
        const honeypot = contactForm.querySelector('input[name="website"]');
        if (honeypot && honeypot.value) {
            e.preventDefault();
            return false; // Bot detected
        }
        
        if (!isValid) {
            e.preventDefault();
            showFormMessage('error', validator.errors[0].message);
            return false;
        }
        
        // Show sending message
        showFormMessage('info', 'Sending your message...');
        
        // Netlify will handle the actual submission and redirect
    });
}

function showFormMessage(type, message) {
    const formFeedback = document.getElementById('formFeedback');
    const feedbackMessage = document.getElementById('feedbackMessage');
    
    if (formFeedback && feedbackMessage) {
        feedbackMessage.textContent = message;
        formFeedback.className = 'form-message ' + type;
        formFeedback.style.display = 'flex';
        
        // Auto hide after 5 seconds (except for 'info' type)
        if (type !== 'info') {
            setTimeout(() => {
                formFeedback.style.display = 'none';
            }, 5000);
        }
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===================================
// SCROLL ANIMATIONS
// ===================================
function animateOnScroll() {
    const elements = document.querySelectorAll('.mission-card, .event-card, .partnership-card, .benefit-card, .impact-example, .testimonial-card');
    
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.6s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(element => {
            observer.observe(element);
        });
    }
}

// ===================================
// PRAYER REQUEST MODAL
// ===================================
function openModal(type) {
    const modal = document.getElementById('prayerModal');
    const prayerTypeInput = document.getElementById('prayerType');
    
    if (modal && prayerTypeInput) {
        prayerTypeInput.value = type;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus trap
        const focusableElements = modal.querySelectorAll('button, input, textarea, select, a[href]');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }
}

function closeModal() {
    const modal = document.getElementById('prayerModal');
    
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset form
        const prayerForm = document.getElementById('prayerForm');
        if (prayerForm) {
            prayerForm.reset();
        }
    }
}

// Initialize prayer modal if it exists
const prayerModal = document.getElementById('prayerModal');
if (prayerModal) {
    // Close modal when clicking outside
    prayerModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && prayerModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Add swipe-to-close for mobile
    let touchStartY = 0;
    prayerModal.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    prayerModal.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        if (touchStartY - touchEndY > 100) { // Swipe up to close
            closeModal();
        }
    }, { passive: true });
    
    // Handle form submission
    const prayerForm = document.getElementById('prayerForm');
    if (prayerForm) {
        const validator = new FormValidator('prayerForm');
        
        prayerForm.addEventListener('submit', function(e) {
            validator.clearErrors();
            
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const category = document.getElementById('category');
            const request = document.getElementById('request');
            
            let isValid = true;
            let errorMessage = '';
            
            // Validate name
            if (name && !name.value.trim()) {
                isValid = false;
                errorMessage = 'Please enter your name.';
                validator.addError(name, errorMessage);
            }
            
            // Validate email
            else if (email && !email.value.trim()) {
                isValid = false;
                errorMessage = 'Please enter your email address.';
                validator.addError(email, errorMessage);
            } else if (email && !isValidEmail(email.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
                validator.addError(email, errorMessage);
            }
            
            // Validate category
            else if (category && !category.value) {
                isValid = false;
                errorMessage = 'Please select a category.';
                validator.addError(category, errorMessage);
            }
            
            // Validate request
            else if (request && !request.value.trim()) {
                isValid = false;
                errorMessage = 'Please enter your prayer request.';
                validator.addError(request, errorMessage);
            }
            
            // Check honeypot
            const honeypot = prayerForm.querySelector('input[name="website"]');
            if (honeypot && honeypot.value) {
                e.preventDefault();
                return false;
            }
            
            if (!isValid) {
                e.preventDefault();
                alert(errorMessage);
                return false;
            }
            
            // Sanitize inputs
            if (request) {
                request.value = sanitizeInput(request.value);
            }
            
            // Let Netlify handle submission
        });
    }
}

// Input sanitization
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Make functions globally available
window.openModal = openModal;
window.closeModal = closeModal;

// ===================================
// PARSE URL PARAMETERS
// ===================================
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Pre-fill form fields from URL parameters
function prefillFormFromURL() {
    const eventParam = getURLParameter('event');
    const typeParam = getURLParameter('type');
    const subjectParam = getURLParameter('subject');
    
    const subjectField = document.getElementById('subject');
    const messageField = document.getElementById('message');
    
    if (subjectField && subjectField.tagName === 'SELECT') {
        if (eventParam) {
            subjectField.value = 'events';
            if (messageField && !messageField.value) {
                messageField.value = `I would like to register for the ${eventParam.replace(/-/g, ' ')} event.\n\n`;
            }
        } else if (typeParam) {
            subjectField.value = 'partnership';
            if (messageField && !messageField.value) {
                messageField.value = `I am interested in ${typeParam.replace(/-/g, ' ')}.\n\n`;
            }
        } else if (subjectParam) {
            subjectField.value = subjectParam;
        }
    } else if (subjectField && subjectField.tagName === 'INPUT') {
        if (eventParam) {
            subjectField.value = `Event Registration: ${eventParam.replace(/-/g, ' ')}`;
        } else if (typeParam) {
            subjectField.value = `Partnership Inquiry: ${typeParam.replace(/-/g, ' ')}`;
        }
    }
}

// ===================================
// DYNAMIC COPYRIGHT YEAR
// ===================================
function updateCopyrightYear() {
    const yearElements = document.querySelectorAll('.footer-bottom p, #year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        if (element.id === 'year') {
            element.textContent = currentYear;
        } else if (element.textContent.includes('©')) {
            element.textContent = element.textContent.replace(/© \d{4}/, `© ${currentYear}`);
        }
    });
}

// ===================================
// SCROLL TO TOP BUTTON
// ===================================
const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    }, 200));
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// INITIALIZE ON DOM LOAD
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    // Set active navigation
    setActiveNavigation();
    
    // Animate elements on scroll
    animateOnScroll();
    
    // Pre-fill form from URL parameters
    prefillFormFromURL();
    
    // Update copyright year
    updateCopyrightYear();
    
    // Add loading class removal
    document.body.classList.add('loaded');
    
    // Initialize lazy loading for images
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
    
    // Add touch feedback for mobile
    if ('ontouchstart' in window) {
        document.querySelectorAll('.btn, .card, button').forEach(el => {
            el.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            }, { passive: true });
            
            el.addEventListener('touchend', function() {
                this.style.transform = '';
            }, { passive: true });
        });
    }
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===================================
// ACCESSIBILITY IMPROVEMENTS
// ===================================

// Skip to main content
const skipLink = document.querySelector('.skip-to-content');
if (skipLink) {
    skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const main = document.querySelector('main') || document.querySelector('.hero');
        if (main) {
            main.setAttribute('tabindex', '-1');
            main.focus();
        }
    });
}

// Announce page changes for screen readers
function announcePageChange(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ===================================
// OFFLINE DETECTION
// ===================================
window.addEventListener('online', () => {
    console.log('Back online');
    announcePageChange('Connection restored');
});

window.addEventListener('offline', () => {
    console.log('Connection lost');
    announcePageChange('No internet connection');
    
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="position: fixed; bottom: 20px; left: 20px; background: #f59e0b; color: white; padding: 1rem 1.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 9999;">
            <strong>⚠️ You're offline</strong>
            <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">Some features may not work.</p>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
});

// ===================================
// SERVICE WORKER REGISTRATION
// ===================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}

// ===================================
// EXPORT FOR MODULE SYSTEMS (Optional)
// ===================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        setActiveNavigation,
        formatCurrency,
        debounce,
        throttle,
        isValidEmail,
        sanitizeInput,
        FormValidator,
        ErrorTracker
    };
}

// ===================================
// END OF MAIN.JS
// ===================================