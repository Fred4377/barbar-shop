// script.js

// Loading Screen
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500); // Wait for transition to finish
        }
    }, 1000);
});

// Hamburger Menu
const hamburger = document.querySelector('.hamburger');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-links a');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navbar.classList.toggle('active');
        
        // Toggle icon between bars and times
        const icon = hamburger.querySelector('i');
        if (navbar.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });
}

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
        const icon = hamburger.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Reveal only once
        }
    });
};

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// Lightbox for Gallery
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.querySelector('.close-lightbox');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').src;
        if (lightboxImg && lightbox) {
            lightboxImg.src = imgSrc;
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    });
});

if (closeLightbox) {
    closeLightbox.addEventListener('click', () => {
        if (lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Close lightbox when clicking outside the image
if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
    if (scrollTopBtn) {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    }
});

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// M-Pesa Modal Logic
const bookBtns = document.querySelectorAll('.book-service-btn');
const mpesaModal = document.getElementById('mpesa-modal');
const closeMpesa = document.querySelector('.close-mpesa');
const mpesaServiceName = document.getElementById('mpesa-service-name');
const mpesaPrice = document.getElementById('mpesa-price');
const mpesaPayBtn = document.getElementById('mpesa-pay-btn');
const mpesaFormStep = document.getElementById('mpesa-form-step');
const mpesaLoading = document.getElementById('mpesa-loading');
const mpesaSuccess = document.getElementById('mpesa-success');

if (bookBtns && mpesaModal) {
    bookBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const service = btn.getAttribute('data-service');
            const price = btn.getAttribute('data-price');
            
            if(mpesaServiceName) mpesaServiceName.textContent = service;
            if(mpesaPrice) mpesaPrice.textContent = price;
            
            // Reset modal state
            if(mpesaFormStep) mpesaFormStep.style.display = 'block';
            if(mpesaLoading) mpesaLoading.style.display = 'none';
            if(mpesaSuccess) mpesaSuccess.style.display = 'none';
            const phoneInput = document.getElementById('mpesa-phone');
            if(phoneInput) phoneInput.value = '';
            
            mpesaModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
}

if (closeMpesa && mpesaModal) {
    closeMpesa.addEventListener('click', () => {
        mpesaModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

if (mpesaModal) {
    mpesaModal.addEventListener('click', (e) => {
        if (e.target === mpesaModal) {
            mpesaModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

if (mpesaPayBtn) {
    mpesaPayBtn.addEventListener('click', () => {
        const phoneInput = document.getElementById('mpesa-phone');
        if (phoneInput && phoneInput.value.length < 9) {
            alert("Please enter a valid M-Pesa phone number.");
            return;
        }
        
        // Show loading state
        if(mpesaFormStep) mpesaFormStep.style.display = 'none';
        if(mpesaLoading) mpesaLoading.style.display = 'block';
        
        // Simulate STK Push delay
        setTimeout(() => {
            if(mpesaLoading) mpesaLoading.style.display = 'none';
            if(mpesaSuccess) mpesaSuccess.style.display = 'block';
            
            // Auto close after 3 seconds
            setTimeout(() => {
                if(mpesaModal) mpesaModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 3000);
        }, 3000);
    });
}
