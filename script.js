// Main JavaScript for PhoTech Website

document.addEventListener('DOMContentLoaded', function() {
    // Custom cursor
    initCustomCursor();
    
    // Logo click handler
    initLogoClick();
    
    // Smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Order form handling
    initOrderForm();
    
    // Template selection
    initTemplateSelection();
    
    // Order tracking
    initOrderTracking();
    
    // FAQ accordion
    initFAQAccordion();
    
    // Active nav link highlighting
    initActiveNav();
    
    // Button sound effects
    initButtonSounds();
});

// Custom cursor functionality
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorHover = document.querySelector('.cursor-hover');
    
    if (cursor && cursorHover) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            cursorHover.style.left = e.clientX + 'px';
            cursorHover.style.top = e.clientY + 'px';
        });
        
        // Add hover effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .sound-btn, .nav-link, .main-logo');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursorHover.classList.add('active');
            });
            
            element.addEventListener('mouseleave', () => {
                cursorHover.classList.remove('active');
            });
        });
    }
}

// Logo click handler - refresh and scroll to top
function initLogoClick() {
    const logoEl = document.getElementById('logo');
    if (logoEl) {
        logoEl.addEventListener('click', (e) => {
            e.preventDefault();
            // Scroll to top with smooth animation
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            // Refresh the page after scroll completes
            setTimeout(() => {
                location.reload();
            }, 450);
        });
    }
}

// Smooth scrolling function
function initSmoothScrolling() {
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Button sound effects
function initButtonSounds() {
    const clickSound = document.getElementById('clickSound');
    const soundButtons = document.querySelectorAll('.sound-btn');
    
    soundButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (clickSound) {
                clickSound.currentTime = 0;
                clickSound.play().catch(e => {
                    console.log('Audio play failed:', e);
                });
            }
        });
    });
}

// Order Form Functionality
let currentStep = 1;
let orderData = {
    photo: null,
    size: '4R',
    paper: 'glossy',
    quantity: 1,
    template: 'none',
    customerInfo: {}
};

function initOrderForm() {
    // Upload area functionality
    const uploadArea = document.getElementById('uploadArea');
    const photoUpload = document.getElementById('photoUpload');
    const imagePreview = document.getElementById('imagePreview');
    const previewImage = document.getElementById('previewImage');
    const removeImage = document.getElementById('removeImage');

    if (uploadArea && photoUpload) {
        // Click to upload
        uploadArea.addEventListener('click', () => {
            photoUpload.click();
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleImageUpload(files[0]);
            }
        });

        // File input change
        photoUpload.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleImageUpload(e.target.files[0]);
            }
        });
    }

    // Remove image
    if (removeImage) {
        removeImage.addEventListener('click', (e) => {
            e.stopPropagation();
            resetImageUpload();
        });
    }

    // Size options
    document.querySelectorAll('.size-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            orderData.size = option.dataset.size;
            updateOrderSummary();
        });
    });

    // Paper type
    const paperType = document.getElementById('paperType');
    if (paperType) {
        paperType.addEventListener('change', (e) => {
            orderData.paper = e.target.value;
            updateOrderSummary();
        });
    }

    // Template
    const templateSelect = document.getElementById('template');
    if (templateSelect) {
        templateSelect.addEventListener('change', (e) => {
            orderData.template = e.target.value;
            updateOrderSummary();
        });
    }

    function getTemplateName(template) {
    const templates = {
        'none': 'No Template',
        'classic': 'Classic Frame',
        'collage': 'Fun Collage',
        'seasonal': 'Seasonal Theme',
        'school': 'School Spirit'
    };
    return templates[template] || 'No Template';
}

// And in the review section:
if (reviewTemplate) reviewTemplate.textContent = getTemplateName(orderData.template);
    // Quantity input
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.addEventListener('change', (e) => {
            let newQuantity = parseInt(e.target.value);
            if (newQuantity >= 1 && newQuantity <= 10) {
                orderData.quantity = newQuantity;
                updateOrderSummary();
            } else {
                e.target.value = orderData.quantity;
            }
        });
    }

    // Initialize summary
    updateOrderSummary();
}

function handleImageUpload(file) {
    if (!file.type.startsWith('image/')) {
        showNotification('Please upload an image file (JPG, PNG, JPEG)', 'error');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        showNotification('File size must be less than 10MB', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        orderData.photo = e.target.result;
        
        // Show preview
        const uploadArea = document.getElementById('uploadArea');
        const imagePreview = document.getElementById('imagePreview');
        const previewImage = document.getElementById('previewImage');
        
        if (uploadArea) uploadArea.style.display = 'none';
        if (imagePreview) imagePreview.style.display = 'block';
        if (previewImage) previewImage.src = e.target.result;
        
        showNotification('Photo uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
}

function resetImageUpload() {
    orderData.photo = null;
    const uploadArea = document.getElementById('uploadArea');
    const imagePreview = document.getElementById('imagePreview');
    const photoUpload = document.getElementById('photoUpload');
    const previewImage = document.getElementById('previewImage');
    
    if (uploadArea) uploadArea.style.display = 'block';
    if (imagePreview) imagePreview.style.display = 'none';
    if (photoUpload) photoUpload.value = '';
    if (previewImage) previewImage.src = '';
}

function changeQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    if (!quantityInput) return;
    
    let newQuantity = parseInt(quantityInput.value) + change;
    
    if (newQuantity >= 1 && newQuantity <= 10) {
        quantityInput.value = newQuantity;
        orderData.quantity = newQuantity;
        updateOrderSummary();
    }
}

function updateOrderSummary() {
    // Size prices
    const sizePrices = {
        '4R': 25,
        '5R': 35,
        '8R': 50
    };

    const basePrice = sizePrices[orderData.size] || 25;
    const total = basePrice * orderData.quantity;

    // Update summary display
    const summarySize = document.getElementById('summary-size');
    const summaryPaper = document.getElementById('summary-paper');
    const summaryQuantity = document.getElementById('summary-quantity');
    const summaryTotal = document.getElementById('summary-total');
    
    if (summarySize) summarySize.textContent = `${orderData.size} (${getSizeDimensions(orderData.size)})`;
    if (summaryPaper) summaryPaper.textContent = getPaperName(orderData.paper);
    if (summaryQuantity) summaryQuantity.textContent = orderData.quantity;
    if (summaryTotal) summaryTotal.textContent = `₱${total}`;
}

function getSizeDimensions(size) {
    const dimensions = {
        '4R': '4×6"',
        '5R': '5×7"',
        '8R': '8×10"'
    };
    return dimensions[size] || '4×6"';
}

function getPaperName(paper) {
    const papers = {
        'glossy': 'Glossy Photo Paper',
        'matte': 'Matte Photo Paper',
        'premium': 'Premium Lustre'
    };
    return papers[paper] || 'Glossy Photo Paper';
}

function getTemplateName(template) {
    const templates = {
        'none': 'No Template',
        'classic': 'Classic Frame',
        'collage': 'Fun Collage',
        'seasonal': 'Seasonal Theme',
        'school': 'School Spirit'
    };
    return templates[template] || 'No Template';
}

function nextStep(step) {
    // Validation
    if (step === 2 && !orderData.photo) {
        showNotification('Please upload a photo first', 'error');
        return;
    }

    if (step === 3) {
        // Update review section
        const reviewImage = document.getElementById('reviewImage');
        const reviewSize = document.getElementById('review-size');
        const reviewPaper = document.getElementById('review-paper');
        const reviewQuantity = document.getElementById('review-quantity');
        const reviewTemplate = document.getElementById('review-template');
        const reviewTotal = document.getElementById('review-total');
        
        if (reviewImage && orderData.photo) reviewImage.src = orderData.photo;
        if (reviewSize) reviewSize.textContent = `${orderData.size} (${getSizeDimensions(orderData.size)})`;
        if (reviewPaper) reviewPaper.textContent = getPaperName(orderData.paper);
        if (reviewQuantity) reviewQuantity.textContent = `${orderData.quantity} copy${orderData.quantity > 1 ? 's' : ''}`;
        if (reviewTemplate) reviewTemplate.textContent = getTemplateName(orderData.template);
        
        const sizePrices = {
            '4R': 25,
            '5R': 35,
            '8R': 50
        };
        const total = (sizePrices[orderData.size] || 25) * orderData.quantity;
        if (reviewTotal) reviewTotal.textContent = `₱${total}`;
    }

    // Update steps
    document.querySelectorAll('.process-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    const currentStepEl = document.querySelector(`.process-step[data-step="${step}"]`);
    if (currentStepEl) currentStepEl.classList.add('active');

    document.querySelectorAll('.form-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    const nextStepEl = document.getElementById(`step${step}`);
    if (nextStepEl) nextStepEl.classList.add('active');

    currentStep = step;
}

function prevStep(step) {
    nextStep(step);
}

function submitOrder() {
    // Validate customer info
    const name = document.getElementById('customerName')?.value.trim();
    const grade = document.getElementById('customerGrade')?.value.trim();
    const phone = document.getElementById('customerPhone')?.value.trim();

    if (!name || !grade || !phone) {
        showNotification('Please fill in all required fields (Name, Grade & Section, Phone)', 'error');
        return;
    }

    if (!/^09\d{9}$/.test(phone)) {
        showNotification('Please enter a valid Philippine phone number (09XXXXXXXXX)', 'error');
        return;
    }

    // Prepare order data
    orderData.customerInfo = {
        name: name,
        grade: grade,
        phone: phone,
        email: document.getElementById('customerEmail')?.value.trim() || '',
        instructions: document.getElementById('specialInstructions')?.value.trim() || ''
    };

    // Calculate total
    const sizePrices = {
        '4R': 25,
        '5R': 35,
        '8R': 50
    };
    const total = (sizePrices[orderData.size] || 25) * orderData.quantity;

    // Show success message
    showNotification(`Order submitted successfully! Total: ₱${total}. We will contact you soon.`, 'success');

    // Reset form after delay
    setTimeout(() => {
        resetOrderForm();
    }, 3000);
}

function resetOrderForm() {
    // Reset to step 1
    nextStep(1);
    
    // Clear all data
    orderData = {
        photo: null,
        size: '4R',
        paper: 'glossy',
        quantity: 1,
        template: 'none',
        customerInfo: {}
    };
    
    // Reset form elements
    resetImageUpload();
    
    const quantityInput = document.getElementById('quantity');
    const paperType = document.getElementById('paperType');
    const templateSelect = document.getElementById('template');
    const customerName = document.getElementById('customerName');
    const customerGrade = document.getElementById('customerGrade');
    const customerPhone = document.getElementById('customerPhone');
    const customerEmail = document.getElementById('customerEmail');
    const specialInstructions = document.getElementById('specialInstructions');
    
    if (quantityInput) quantityInput.value = 1;
    if (paperType) paperType.value = 'glossy';
    if (templateSelect) templateSelect.value = 'none';
    if (customerName) customerName.value = '';
    if (customerGrade) customerGrade.value = '';
    if (customerPhone) customerPhone.value = '';
    if (customerEmail) customerEmail.value = '';
    if (specialInstructions) specialInstructions.value = '';
    
    // Reset size options
    document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('active'));
    const defaultSize = document.querySelector('.size-option[data-size="4R"]');
    if (defaultSize) defaultSize.classList.add('active');
    
    updateOrderSummary();
}

// Template selection
function initTemplateSelection() {
    const templateButtons = document.querySelectorAll('.template-btn');
    
    templateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const template = this.getAttribute('data-template');
            
            // Scroll to order form
            const orderSection = document.getElementById('order');
            if (orderSection) {
                orderSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
            
            showNotification(`"${this.parentElement.querySelector('h3').textContent}" template selected!`, 'success');
        });
    });
}

// Order tracking
function initOrderTracking() {
    const trackBtn = document.getElementById('trackBtn');
    const orderNumberInput = document.getElementById('orderNumber');
    const trackingResult = document.getElementById('trackingResult');
    
    if (trackBtn) {
        trackBtn.addEventListener('click', function() {
            const orderNumber = orderNumberInput?.value.trim();
            
            if (!orderNumber) {
                showNotification('Please enter an order number.', 'error');
                return;
            }
            
            // Simulate tracking lookup
            showNotification('Looking up your order...', 'info');
            
            setTimeout(() => {
                // Mock tracking results based on order number
                let status, message;
                
                if (orderNumber.toLowerCase().includes('pho')) {
                    status = 'Ready for Pickup';
                    message = 'Your order is ready! Please pick it up at Room 304.';
                } else if (orderNumber.length > 3) {
                    status = 'In Progress';
                    message = 'Your order is being processed. Check back tomorrow.';
                } else {
                    status = 'Order Not Found';
                    message = 'Please check your order number and try again.';
                }
                
                // Update tracking result display
                if (trackingResult) {
                    trackingResult.innerHTML = `
                        <h4>Order Status: ${status}</h4>
                        <p>${message}</p>
                        <p><strong>Order #:</strong> ${orderNumber}</p>
                        <p><em>Typical turnaround: 24 hours on school days</em></p>
                    `;
                }
            }, 1500);
        });
    }
}

// FAQ accordion
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
}

// Active navigation highlighting
function initActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '5px',
        color: '#fff',
        fontWeight: '500',
        zIndex: '10000',
        maxWidth: '300px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    const bgColors = {
        success: '#4CAF50',
        error: '#f44336',
        info: '#2196F3'
    };
    
    notification.style.backgroundColor = bgColors[type] || bgColors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
`;
document.head.appendChild(notificationStyles);