// ===================================
// BESORAH YESHUA MINISTRY - MAIN JAVASCRIPT
// Complete Fixed & Optimized Version
// Version: 3.0 - Enhanced with Logo Fix & Mobile Optimization
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
// LOGO LOADING HANDLER
// ===================================
class LogoLoader {
    constructor() {
        this.init();
    }
    
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.handleLogos();
            this.preloadLogo();
        });
    }
    
    handleLogos() {
        const logos = document.querySelectorAll('.logo, .footer-logo');
        
        logos.forEach(logo => {
            // Add error handler for failed loads
            logo.addEventListener('error', () => this.createFallback(logo));
            
            // Force reload if src is empty or undefined
            if (!logo.src || logo.src.includes('undefined')) {
                logo.src = '/images/logo.png';
            }
            
            // Check if image loaded successfully
            if (logo.complete && logo.naturalHeight === 0) {
                this.createFallback(logo);
            }
        });
        
        // Log current logo paths for debugging
        console.log('Logo paths:', Array.from(logos).map(l => l.src));
    }
    
    createFallback(imgElement) {
        console.warn('Logo failed to load:', imgElement.src);
        
        const isFooter = imgElement.classList.contains('footer-logo');
        const size = isFooter ? 80 : 50;
        const fontSize = isFooter ? 2 : 1.2;
        
        // Create fallback div
        const fallback = document.createElement('div');
        fallback.className = imgElement.className + ' logo-fallback';
        fallback.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: linear-gradient(135deg, #205782, #2d6fa0);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: ${fontSize}rem;
            box-shadow: 0 4px 15px rgba(242, 132, 47, 0.3);
            border: 2px solid rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease;
        `;
        fallback.textContent = 'BY';
        fallback.setAttribute('role', 'img');
        fallback.setAttribute('aria-label', 'Besorah Yeshua Logo');
        
        // Replace the broken image
        imgElement.parentNode.replaceChild(fallback, imgElement);
    }
    
    preloadLogo() {
        const preloadImg = new Image();
        const paths = ['/images/logo.png', './images/logo.png', '../images/logo.png'];
        
        const tryLoad = (index) => {
            if (index >= paths.length) {
                console.error('All logo paths failed. Using fallback.');
                return;
            }
            
            preloadImg.src = paths[index];
            preloadImg.onerror = () => tryLoad(index + 1);
            preloadImg.onload = () => {
                console.log('Logo preloaded successfully from:', paths[index]);
            };
        };
        
        tryLoad(0);
    }
}

const logoLoader = new LogoLoader();

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
            <div style="position: fixed; top: 90px; right: 20px; background: #dc2626; color: white; padding: 1rem 1.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 9999; max-width: 300px; animation: slideInRight 0.3s ease;">
                <strong>⚠️ Something went wrong</strong>
                <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">Please refresh the page and try again.</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
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
        errorDiv.className = 'field-error';
        errorDiv.setAttribute('role', 'alert');
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        field.parentElement.appendChild(errorDiv);
        field.classList.add('error');
        
        // Remove error on input
        field.addEventListener('input', () => {
            errorDiv.remove();
            field.classList.remove('error');
        }, { once: true });
    }
    
    clearErrors() {
        this.form.querySelectorAll('.field-error').forEach(el => el.remove());
        this.form.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
    }
}

// ===================================
// MOBILE NAVIGATION - ENHANCED
// ===================================
class MobileNavigation {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isOpen = false;
        
        if (this.hamburger && this.navMenu) {
            this.init();
        }
    }
    
    init() {
        // Toggle menu
        this.hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Close mobile menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.hamburger.contains(e.target) && 
                !this.navMenu.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
        
        // Handle resize - close menu if switching to desktop
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 968 && this.isOpen) {
                    this.closeMenu();
                }
            }, 250);
        });
    }
    
    toggleMenu() {
        this.isOpen = !this.isOpen;
        
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        
        // Update ARIA attribute for accessibility
        this.hamburger.setAttribute('aria-expanded', this.isOpen);
        this.navMenu.setAttribute('aria-hidden', !this.isOpen);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.isOpen ? 'hidden' : '';
        
        // Add overlay for mobile menu
        if (this.isOpen) {
            this.createOverlay();
        } else {
            this.removeOverlay();
        }
    }
    
    closeMenu() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        this.hamburger.setAttribute('aria-expanded', 'false');
        this.navMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        this.removeOverlay();
    }
    
    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 998;
            animation: fadeIn 0.3s ease;
        `;
        overlay.addEventListener('click', () => this.closeMenu());
        document.body.appendChild(overlay);
    }
    
    removeOverlay() {
        const overlay = document.querySelector('.nav-overlay');
        if (overlay) {
            overlay.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => overlay.remove(), 300);
        }
    }
}

const mobileNav = new MobileNavigation();

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
        
        // Auto-hide on scroll down (optional - uncomment if desired)
        // if (currentScroll > lastScroll && currentScroll > 100) {
        //     header.style.transform = 'translateY(-100%)';
        // } else {
        //     header.style.transform = 'translateY(0)';
        // }
        
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
            
            // Focus management for accessibility
            target.setAttribute('tabindex', '-1');
            target.focus();
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
            eventCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.setAttribute('aria-hidden', 'false');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    card.setAttribute('aria-hidden', 'true');
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            
            // Announce filter change for screen readers
            announcePageChange(`Showing ${filter === 'all' ? 'all' : filter} events`);
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
        
        // Prevent negative numbers
        customAmountField.addEventListener('keydown', function(e) {
            if (e.key === '-' || e.key === 'e') {
                e.preventDefault();
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
        
        // Validate name
        if (name && !name.value.trim()) {
            isValid = false;
            validator.addError(name, 'Please enter your name');
        } else if (name && name.value.trim().length < 2) {
            isValid = false;
            validator.addError(name, 'Name must be at least 2 characters');
        }
        
        // Validate email
        if (email && !email.value.trim()) {
            isValid = false;
            validator.addError(email, 'Please enter your email address');
        } else if (email && !isValidEmail(email.value)) {
            isValid = false;
            validator.addError(email, 'Please enter a valid email address');
        }
        
        // Validate message
        if (message && !message.value.trim()) {
            isValid = false;
            validator.addError(message, 'Please enter a message');
        } else if (message && message.value.trim().length < 10) {
            isValid = false;
            validator.addError(message, 'Message must be at least 10 characters');
        }
        
        // Check honeypot field
        const honeypot = contactForm.querySelector('input[name="website"]');
        if (honeypot && honeypot.value) {
            e.preventDefault();
            return false; // Bot detected
        }
        
        if (!isValid) {
            e.preventDefault();
            showFormMessage('error', 'Please fix the errors above');
            // Scroll to first error
            const firstError = contactForm.querySelector('.field-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
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
    const elements = document.querySelectorAll('.mission-card, .event-card, .partnership-card, .benefit-card, .impact-example, .testimonial-card, .zone-card, .area-card, .impact-card');
    
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
            // Clear any errors
            const errors = prayerForm.querySelectorAll('.field-error');
            errors.forEach(error => error.remove());
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
    let touchStartX = 0;
    
    prayerModal.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    prayerModal.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndX = e.changedTouches[0].clientX;
        const diffY = touchStartY - touchEndY;
        const diffX = Math.abs(touchStartX - touchEndX);
        
        // Swipe down to close (and not horizontal swipe)
        if (diffY < -100 && diffX < 50) {
            closeModal();
        }
    }, { passive: true });
    
    // Handle form submission
    const prayerForm = document.getElementById('prayerForm');
    if (prayerForm) {
        const validator = new FormValidator('prayerForm');
        
        prayerForm.addEventListener('submit', function(e) {
            validator.clearErrors();
            
            const name = document.getElementById('prayerName') || document.getElementById('name');
            const email = document.getElementById('prayerEmail') || document.getElementById('email');
            const category = document.getElementById('category');
            const request = document.getElementById('request');
            
            let isValid = true;
            
            // Validate name
            if (name && !name.value.trim()) {
                isValid = false;
                validator.addError(name, 'Please enter your name');
            }
            
            // Validate email
            if (email && !email.value.trim()) {
                isValid = false;
                validator.addError(email, 'Please enter your email address');
            } else if (email && !isValidEmail(email.value)) {
                isValid = false;
                validator.addError(email, 'Please enter a valid email address');
            }
            
            // Validate category
            if (category && !category.value) {
                isValid = false;
                validator.addError(category, 'Please select a category');
            }
            
            // Validate request
            if (request && !request.value.trim()) {
                isValid = false;
                validator.addError(request, 'Please enter your prayer request');
            } else if (request && request.value.trim().length < 10) {
                isValid = false;
                validator.addError(request, 'Prayer request must be at least 10 characters');
            }
            
            // Check honeypot
            const honeypot = prayerForm.querySelector('input[name="website"]');
            if (honeypot && honeypot.value) {
                e.preventDefault();
                return false;
            }
            
            if (!isValid) {
                e.preventDefault();
                const firstError = prayerForm.querySelector('.field-error');
                if (firstError) {
                    firstError.parentElement.querySelector('input, textarea, select').focus();
                }
                return false;
            }
            
            // Sanitize inputs before submission
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
            scrollTopBtn.style.display = 'flex';
            scrollTopBtn.style.opacity = '1';
        } else {
            scrollTopBtn.style.opacity = '0';
            setTimeout(() => {
                if (window.pageYOffset <= 300) {
                    scrollTopBtn.style.display = 'none';
                }
            }, 300);
        }
    }, 200));
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Keyboard accessibility
    scrollTopBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}

// ===================================
// CHARACTER COUNTER FOR TEXTAREAS
// ===================================
function initCharacterCounters() {
    const textareas = document.querySelectorAll('textarea[maxlength]');
    
    textareas.forEach(textarea => {
        const maxLength = textarea.getAttribute('maxlength');
        
        // Create counter element
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.textContent = `0 / ${maxLength}`;
        
        // Insert after textarea
        textarea.parentElement.appendChild(counter);
        
        // Update counter on input
        textarea.addEventListener('input', function() {
            const length = this.value.length;
            counter.textContent = `${length} / ${maxLength}`;
            
            // Change color when near limit
            if (length > maxLength * 0.9) {
                counter.style.color = '#dc2626';
            } else if (length > maxLength * 0.75) {
                counter.style.color = '#f59e0b';
            } else {
                counter.style.color = '#64748b';
            }
        });
    });
}

// ===================================
// VIDEO BACKGROUND OPTIMIZATION
// ===================================
function optimizeVideoBackground() {
    const heroVideo = document.querySelector('.hero-video');
    
    if (heroVideo) {
        // Pause video on mobile to save bandwidth
        if (window.innerWidth < 768) {
            heroVideo.pause();
            heroVideo.style.display = 'none';
        }
        
        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                heroVideo.pause();
            } else if (window.innerWidth >= 768) {
                heroVideo.play().catch(e => console.log('Video play failed:', e));
            }
        });
        
        // Reduce quality on slow connections
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                heroVideo.pause();
                heroVideo.style.display = 'none';
            }
        }
    }
}

// ===================================
// LAZY LOADING IMAGES
// ===================================
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        script.async = true;
        document.body.appendChild(script);
    }
}

// ===================================
// TOUCH FEEDBACK FOR MOBILE
// ===================================
function initTouchFeedback() {
    if ('ontouchstart' in window) {
        const touchElements = document.querySelectorAll('.btn, .card, button, .nav-link, .filter-btn, .amount-btn, .frequency-btn, .payment-btn');
        
        touchElements.forEach(el => {
            el.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
                this.style.transition = 'transform 0.1s ease';
            }, { passive: true });
            
            el.addEventListener('touchend', function() {
                this.style.transform = '';
            }, { passive: true });
            
            el.addEventListener('touchcancel', function() {
                this.style.transform = '';
            }, { passive: true });
        });
    }
}

// ===================================
// FORM AUTO-SAVE (DRAFT)
// ===================================
class FormAutoSave {
    constructor(formId, storageKey) {
        this.form = document.getElementById(formId);
        this.storageKey = storageKey || `form_draft_${formId}`;
        
        if (this.form && this.supportsLocalStorage()) {
            this.init();
        }
    }
    
    supportsLocalStorage() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    init() {
        // Load saved draft
        this.loadDraft();
        
        // Save on input
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', debounce(() => {
                this.saveDraft();
            }, 1000));
        });
        
        // Clear draft on successful submission
        this.form.addEventListener('submit', () => {
            this.clearDraft();
        });
    }
    
    saveDraft() {
        const formData = new FormData(this.form);
        const data = {};
        
        formData.forEach((value, key) => {
            // Don't save honeypot or sensitive fields
            if (key !== 'website' && key !== 'password') {
                data[key] = value;
            }
        });
        
        localStorage.setItem(this.storageKey, JSON.stringify(data));
        console.log('Draft saved');
    }
    
    loadDraft() {
        const savedData = localStorage.getItem(this.storageKey);
        
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                
                Object.keys(data).forEach(key => {
                    const input = this.form.querySelector(`[name="${key}"]`);
                    if (input && !input.value) {
                        input.value = data[key];
                    }
                });
                
                console.log('Draft loaded');
            } catch (e) {
                console.error('Error loading draft:', e);
            }
        }
    }
    
    clearDraft() {
        localStorage.removeItem(this.storageKey);
        console.log('Draft cleared');
    }
}

// Initialize auto-save for contact form
if (document.getElementById('contactForm')) {
    new FormAutoSave('contactForm');
}

// ===================================
// STATISTICS COUNTER ANIMATION
// ===================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number, .impact-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString() + (counter.textContent.includes('+') ? '+' : '');
            }
        };
        
        updateCounter();
    };
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }
}

// ===================================
// ACCESSIBILITY IMPROVEMENTS
// ===================================

// Skip to main content
const skipLink = document.querySelector('.skip-to-content');
if (skipLink) {
    skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const main = document.querySelector('main') || document.querySelector('#main-content') || document.querySelector('.hero');
        if (main) {
            main.setAttribute('tabindex', '-1');
            main.focus();
            main.scrollIntoView({ behavior: 'smooth' });
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
    announcement.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    `;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Keyboard navigation enhancement
document.addEventListener('keydown', (e) => {
    // Alt + H: Go to home
    if (e.altKey && e.key === 'h') {
        window.location.href = 'index.html';
    }
    
    // Alt + C: Go to contact
    if (e.altKey && e.key === 'c') {
        window.location.href = 'contact.html';
    }
    
    // Alt + D: Go to donate
    if (e.altKey && e.key === 'd') {
        window.location.href = 'donate.html';
    }
});

// ===================================
// OFFLINE DETECTION
// ===================================
window.addEventListener('online', () => {
    console.log('Back online');
    announcePageChange('Connection restored');
    hideOfflineNotification();
});

window.addEventListener('offline', () => {
    console.log('Connection lost');
    announcePageChange('No internet connection');
    showOfflineNotification();
});

function showOfflineNotification() {
    // Remove existing notification
    hideOfflineNotification();
    
    const notification = document.createElement('div');
    notification.id = 'offlineNotification';
    notification.innerHTML = `
        <div style="position: fixed; bottom: 20px; left: 20px; background: #f59e0b; color: white; padding: 1rem 1.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 9999; max-width: 300px; animation: slideInLeft 0.3s ease;">
            <strong>⚠️ You're offline</strong>
            <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">Some features may not work.</p>
        </div>
    `;
    document.body.appendChild(notification);
}

function hideOfflineNotification() {
    const notification = document.getElementById('offlineNotification');
    if (notification) {
        notification.style.animation = 'slideOutLeft 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }
}

// ===================================
// SERVICE WORKER REGISTRATION
// ===================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New version available
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}

function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="position: fixed; top: 90px; right: 20px; background: #3b82f6; color: white; padding: 1rem 1.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 9999; max-width: 300px;">
            <strong>🎉 Update Available</strong>
            <p style="margin: 0.5rem 0; font-size: 0.9rem;">A new version is available.</p>
            <button onclick="window.location.reload()" style="background: white; color: #3b82f6; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-weight: 600; margin-top: 0.5rem;">
                Update Now
            </button>
        </div>
    `;
    document.body.appendChild(notification);
}

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

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Copy to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copied to clipboard!');
        }).catch(err => {
            console.error('Copy failed:', err);
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showToast('Copied to clipboard!');
    } catch (err) {
        console.error('Fallback copy failed:', err);
    }
    document.body.removeChild(textArea);
}

// Toast notification
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ===================================
// PERFORMANCE: REDUCE LAYOUT SHIFTS
// ===================================
function preventLayoutShifts() {
    // Add aspect ratio to images without explicit dimensions
    document.querySelectorAll('img:not([width]):not([height])').forEach(img => {
        if (img.naturalWidth && img.naturalHeight) {
            const ratio = (img.naturalHeight / img.naturalWidth) * 100;
            img.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
        }
    });
}

// ===================================
// ANALYTICS HELPERS (Privacy-Friendly)
// ===================================
function trackEvent(category, action, label) {
    // Log to console (replace with your analytics service)
    console.log('Event:', { category, action, label });
    
    // Example: Track button clicks
    // if (window.plausible) {
    //     window.plausible('Event', { props: { category, action, label } });
    // }
}

// Track outbound links
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && link.hostname !== window.location.hostname) {
        trackEvent('Outbound Link', 'Click', link.href);
    }
});

// ===================================
// INITIALIZE ON DOM LOAD
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Besorah Yeshua Ministry - Initializing...');
    
    // Core initialization
    setActiveNavigation();
    animateOnScroll();
    prefillFormFromURL();
    updateCopyrightYear();
    
    // Enhanced features
    initCharacterCounters();
    optimizeVideoBackground();
    initLazyLoading();
    initTouchFeedback();
    animateCounters();
    preventLayoutShifts();
    
    // Mark page as loaded
    document.body.classList.add('loaded');
    
    // Remove page loader if exists
    const pageLoader = document.querySelector('.page-loader');
    if (pageLoader) {
        setTimeout(() => {
            pageLoader.style.opacity = '0';
            setTimeout(() => pageLoader.remove(), 500);
        }, 500);
    }
    
    console.log('✅ Initialization complete');
});

// ===================================
// PAGE VISIBILITY: PAUSE ANIMATIONS
// ===================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause any resource-intensive operations
        console.log('Page hidden - pausing animations');
    } else {
        console.log('Page visible - resuming');
    }
});

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
        copyToClipboard,
        showToast,
        trackEvent,
        FormValidator,
        ErrorTracker,
        LogoLoader,
        MobileNavigation,
        FormAutoSave
    };
}

// ===================================
// ADD REQUIRED CSS ANIMATIONS
// ===================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes slideInLeft {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutLeft {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(-100%); opacity: 0; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

// ===================================
// END OF MAIN.JS
// Version: 3.0 - Complete & Production Ready
// ===================================

console.log('🙏 Besorah Yeshua Ministry - Main.js loaded successfully');