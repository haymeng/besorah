// ===================================
// PRAYER REQUEST PAGE - COMPLETE JAVASCRIPT
// Enhanced with Mobile Support & Validation
// Save as: scripts/prayer.js
// ===================================

'use strict';

// ===================================
// GLOBAL STATE
// ===================================
let touchStartY = 0;
let touchEndY = 0;

// ===================================
// MODAL FUNCTIONS
// ===================================

/**
 * Open prayer request modal
 * @param {string} type - Type of prayer request (praise, petition, intercession, etc.)
 */
function openModal(type) {
    const modal = document.getElementById('prayerModal');
    const prayerTypeInput = document.getElementById('prayerType');
    
    if (!modal) {
        console.error('Prayer modal not found');
        return;
    }
    
    // Set prayer type if input exists
    if (prayerTypeInput) {
        prayerTypeInput.value = type || 'general';
    }
    
    // Add active class with slight delay for animation
    requestAnimationFrame(() => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus on first input for accessibility
        const firstInput = modal.querySelector('input:not([type="hidden"]), textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 300);
        }
    });
    
    // Announce to screen readers
    announceToScreenReader('Prayer request form opened');
}

/**
 * Close prayer request modal
 */
function closeModal() {
    const modal = document.getElementById('prayerModal');
    
    if (!modal) {
        console.error('Prayer modal not found');
        return;
    }
    
    // Remove active class
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Reset form after animation completes
    setTimeout(() => {
        const form = document.getElementById('prayerForm');
        if (form) {
            form.reset();
            clearFormErrors();
        }
    }, 300);
    
    // Announce to screen readers
    announceToScreenReader('Prayer request form closed');
}

// ===================================
// VALIDATION FUNCTIONS
// ===================================

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
}

/**
 * Validate phone number (optional field)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid or empty
 */
function isValidPhone(phone) {
    if (!phone || phone.trim() === '') return true; // Optional field
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Sanitize user input to prevent XSS
 * @param {string} input - User input to sanitize
 * @returns {string} - Sanitized input
 */
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

/**
 * Show field-specific error
 * @param {HTMLElement} field - Input field element
 * @param {string} message - Error message to display
 */
function showFieldError(field, message) {
    if (!field) return;
    
    // Remove existing error
    clearFieldError(field);
    
    // Add error class
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.textContent = message;
    
    // Insert error message after field
    field.parentElement.appendChild(errorDiv);
    
    // Focus on field
    field.focus();
}

/**
 * Clear field-specific error
 * @param {HTMLElement} field - Input field element
 */
function clearFieldError(field) {
    if (!field) return;
    
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');
    
    const errorDiv = field.parentElement.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

/**
 * Clear all form errors
 */
function clearFormErrors() {
    const form = document.getElementById('prayerForm');
    if (!form) return;
    
    // Remove all error classes
    form.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
        el.removeAttribute('aria-invalid');
    });
    
    // Remove all error messages
    form.querySelectorAll('.field-error').forEach(el => {
        el.remove();
    });
}

/**
 * Validate entire form
 * @returns {boolean} - True if form is valid
 */
function validateForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const category = document.getElementById('category');
    const request = document.getElementById('request');
    const phone = document.getElementById('phone');
    
    let isValid = true;
    
    // Clear previous errors
    clearFormErrors();
    
    // Validate name
    if (!name || !name.value.trim()) {
        showFieldError(name, 'Please enter your name');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        showFieldError(name, 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate email
    if (!email || !email.value.trim()) {
        showFieldError(email, 'Please enter your email address');
        isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
        showFieldError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone (if provided)
    if (phone && phone.value.trim() && !isValidPhone(phone.value.trim())) {
        showFieldError(phone, 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Validate category
    if (!category || !category.value) {
        showFieldError(category, 'Please select a prayer category');
        isValid = false;
    }
    
    // Validate request
    if (!request || !request.value.trim()) {
        showFieldError(request, 'Please enter your prayer request');
        isValid = false;
    } else if (request.value.trim().length < 10) {
        showFieldError(request, 'Prayer request must be at least 10 characters');
        isValid = false;
    } else if (request.value.trim().length > 1000) {
        showFieldError(request, 'Prayer request must be less than 1000 characters');
        isValid = false;
    }
    
    return isValid;
}

// ===================================
// FORM SUBMISSION
// ===================================

/**
 * Handle form submission
 * @param {Event} e - Submit event
 */
function handleFormSubmit(e) {
    // Validate form
    if (!validateForm()) {
        e.preventDefault();
        announceToScreenReader('Please correct the errors in the form');
        return false;
    }
    
    // Check honeypot field (spam protection)
    const honeypot = document.getElementById('website');
    if (honeypot && honeypot.value) {
        e.preventDefault();
        console.warn('Spam detected');
        return false;
    }
    
    // Sanitize text inputs before submission
    const request = document.getElementById('request');
    if (request) {
        request.value = sanitizeInput(request.value);
    }
    
    // Show loading state
    const submitButton = document.querySelector('#prayerForm button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    }
    
    // Netlify will handle the actual submission
    // Form will redirect to action URL (prayer-thank-you.html)
    announceToScreenReader('Submitting your prayer request');
    
    // Let the form submit naturally
    return true;
}

// ===================================
// TOUCH GESTURES (Mobile)
// ===================================

/**
 * Handle touch start for swipe gesture
 * @param {TouchEvent} e - Touch start event
 */
function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
}

/**
 * Handle touch end for swipe gesture
 * @param {TouchEvent} e - Touch end event
 */
function handleTouchEnd(e) {
    touchEndY = e.changedTouches[0].clientY;
    handleSwipe();
}

/**
 * Detect and handle swipe gestures
 */
function handleSwipe() {
    const swipeThreshold = 100;
    const diff = touchStartY - touchEndY;
    
    // Swipe down to close modal
    if (diff < -swipeThreshold) {
        closeModal();
    }
}

// ===================================
// ACCESSIBILITY HELPERS
// ===================================

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 */
function announceToScreenReader(message) {
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
// REAL-TIME VALIDATION
// ===================================

/**
 * Setup real-time validation on form fields
 */
function setupRealtimeValidation() {
    const form = document.getElementById('prayerForm');
    if (!form) return;
    
    // Email validation
    const email = document.getElementById('email');
    if (email) {
        email.addEventListener('blur', function() {
            if (this.value.trim() && !isValidEmail(this.value.trim())) {
                showFieldError(this, 'Please enter a valid email address');
            } else {
                clearFieldError(this);
            }
        });
        
        email.addEventListener('input', function() {
            if (this.value.trim() && isValidEmail(this.value.trim())) {
                clearFieldError(this);
            }
        });
    }
    
    // Phone validation
    const phone = document.getElementById('phone');
    if (phone) {
        phone.addEventListener('blur', function() {
            if (this.value.trim() && !isValidPhone(this.value.trim())) {
                showFieldError(this, 'Please enter a valid phone number');
            } else {
                clearFieldError(this);
            }
        });
    }
    
    // Character counter for request
    const request = document.getElementById('request');
    if (request) {
        const maxLength = 1000;
        
        // Create character counter
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.textContent = `0 / ${maxLength} characters`;
        request.parentElement.appendChild(counter);
        
        request.addEventListener('input', function() {
            const length = this.value.length;
            counter.textContent = `${length} / ${maxLength} characters`;
            
            if (length > maxLength) {
                counter.style.color = '#dc2626';
                showFieldError(this, `Maximum ${maxLength} characters allowed`);
            } else if (length > maxLength * 0.9) {
                counter.style.color = '#f59e0b';
                clearFieldError(this);
            } else {
                counter.style.color = '#64748b';
                clearFieldError(this);
            }
        });
    }
}

// ===================================
// INITIALIZATION
// ===================================

/**
 * Initialize prayer request functionality
 */
function initializePrayerRequest() {
    const modal = document.getElementById('prayerModal');
    const prayerForm = document.getElementById('prayerForm');
    
    if (!modal || !prayerForm) {
        console.warn('Prayer modal or form not found on this page');
        return;
    }
    
    // Setup form submission
    prayerForm.addEventListener('submit', handleFormSubmit);
    
    // Setup real-time validation
    setupRealtimeValidation();
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Touch gestures for mobile
    modal.addEventListener('touchstart', handleTouchStart, { passive: true });
    modal.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Close button
    const closeButton = modal.querySelector('.close-modal, [data-close-modal]');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    
    console.log('Prayer request functionality initialized');
}

// ===================================
// DOM READY
// ===================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePrayerRequest);
} else {
    initializePrayerRequest();
}

// ===================================
// EXPORT FUNCTIONS (for global access)
// ===================================

// Make functions available globally
window.openModal = openModal;
window.closeModal = closeModal;
window.validateForm = validateForm;

// ===================================
// ERROR HANDLING
// ===================================

// Global error handler for this module
window.addEventListener('error', function(e) {
    if (e.filename && e.filename.includes('prayer.js')) {
        console.error('Prayer.js error:', e.message);
    }
});

