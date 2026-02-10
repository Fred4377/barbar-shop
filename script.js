// script.js

// TODO: maybe remove this loading screen later, it's a bit annoying in dev mode
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const pageLoader = document.getElementById('loader');
        if (pageLoader) {
            pageLoader.style.opacity = '0';
            setTimeout(() => {
                pageLoader.style.display = 'none';
            }, 500); // wait for fade out
        }
    }, 800); // reduced from 1s to 800ms
});

// Navbar logic
const mobileMenuBtn = document.querySelector('.hamburger');
const mainNav = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-links a');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        
        // toggle the icon
        const iconElement = mobileMenuBtn.querySelector('i');
        if (mainNav.classList.contains('active')) {
            iconElement.classList.replace('fa-bars', 'fa-xmark');
        } else {
            iconElement.classList.replace('fa-xmark', 'fa-bars');
        }
    });
}

// close menu on link click - useful for single page scroll
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        const iconElement = mobileMenuBtn.querySelector('i');
        if (iconElement) {
            iconElement.classList.replace('fa-xmark', 'fa-bars');
        }
    });
});

// sticky header bg
window.addEventListener('scroll', () => {
    if (mainNav) {
        if (window.scrollY > 50) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    }
});

// intersection observer for those cool scroll animations
const scrollElements = document.querySelectorAll('.reveal');

const handleReveal = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // only animate once per page load
        }
    });
};

const observerConfig = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(handleReveal, observerConfig);

scrollElements.forEach(el => revealObserver.observe(el));

// Gallery Lightbox
const galleryThumbs = document.querySelectorAll('.gallery-item');
const lightboxOverlay = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close-lightbox');

galleryThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
        const fullImgSrc = thumb.querySelector('img').src;
        if (lightboxImage && lightboxOverlay) {
            lightboxImage.src = fullImgSrc;
            lightboxOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // stop body scroll
        }
    });
});

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        if (lightboxOverlay) {
            lightboxOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// click outside to close
if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) {
            lightboxOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Scroll to Top 
const backToTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
    if (backToTopBtn) {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }
});

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==========================================
// M-PESA MOCK INTEGRATION LOGIC
// ==========================================
const appointmentBtns = document.querySelectorAll('.book-service-btn');
const checkoutModal = document.getElementById('mpesa-modal');
const closeCheckout = document.querySelector('.close-mpesa');
const checkoutServiceName = document.getElementById('mpesa-service-name');
const checkoutPrice = document.getElementById('mpesa-price');
const triggerStkBtn = document.getElementById('mpesa-pay-btn');
const paymentFormStep = document.getElementById('mpesa-form-step');
const loadingSpinner = document.getElementById('mpesa-loading');
const successMessage = document.getElementById('mpesa-success');

if (appointmentBtns && checkoutModal) {
    appointmentBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceName = btn.getAttribute('data-service');
            const servicePrice = btn.getAttribute('data-price');
            
            if(checkoutServiceName) checkoutServiceName.textContent = serviceName;
            if(checkoutPrice) checkoutPrice.textContent = servicePrice;
            
            // reset UI state
            if(paymentFormStep) paymentFormStep.style.display = 'block';
            if(loadingSpinner) loadingSpinner.style.display = 'none';
            if(successMessage) successMessage.style.display = 'none';
            
            const customerPhone = document.getElementById('mpesa-phone');
            if(customerPhone) customerPhone.value = '';
            
            checkoutModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
}

if (closeCheckout) {
    closeCheckout.addEventListener('click', () => {
        checkoutModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

// Simulate Daraja API STK push
const mockDarajaStkPush = async (phoneNumber) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 90% success rate mock
            if (Math.random() > 0.1) {
                resolve({ status: 'success', message: 'Payment Received' });
            } else {
                reject(new Error('User cancelled the STK prompt'));
            }
        }, 2500); // 2.5s delay to make it look real
    });
};

if (triggerStkBtn) {
    triggerStkBtn.addEventListener('click', () => {
        const customerPhone = document.getElementById('mpesa-phone');
        if (customerPhone && customerPhone.value.length < 9) {
            alert("Please enter a valid Safaricom number (e.g. 0712345678).");
            return;
        }
        
        // Show loader
        if(paymentFormStep) paymentFormStep.style.display = 'none';
        if(loadingSpinner) loadingSpinner.style.display = 'block';
        
        // Mixing promises and async for the legacy Daraja vibes
        mockDarajaStkPush(customerPhone.value)
            .then(result => {
                if(loadingSpinner) loadingSpinner.style.display = 'none';
                if(successMessage) successMessage.style.display = 'block';
                
                // TODO: Save booking to DB here
                
                setTimeout(() => {
                    if(checkoutModal) checkoutModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }, 3000);
            })
            .catch(err => {
                alert(`Payment failed: ${err.message}. Please try again.`);
                // revert to form
                if(loadingSpinner) loadingSpinner.style.display = 'none';
                if(paymentFormStep) paymentFormStep.style.display = 'block';
            });
    });
}
