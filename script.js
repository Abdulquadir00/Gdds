
document.addEventListener('DOMContentLoaded', () => {
    // Check if Alpine.js is loaded
    if (typeof Alpine === 'undefined') {
        console.error('Alpine.js is not loaded. Please check the CDN or script inclusion.');
    } else {
        console.log('Alpine.js is loaded successfully.');
    }

    // Initialize EmailJS
    emailjs.init("Nhyhvf08MTPH-yDBx");

    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 120,
        easing: 'ease-out-quart'
    });

    // Initialize Lightbox
    lightbox.option({
        resizeDuration: 200,
        wrapAround: true,
        disableScrolling: true,
        fitImagesInViewport: true,
        albumLabel: 'Image %1 of %2',
        fadeDuration: 400
    });

    // Dynamic Copyright Year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Hero Slideshow
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    let slideInterval = setInterval(nextSlide, 5000);

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    const slideshow = document.querySelector('.slideshow');
    slideshow.addEventListener('mouseenter', () => clearInterval(slideInterval), { passive: true });
    slideshow.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 5000), { passive: true });

    // Hamburger Menu Toggle
    window.toggleMenu = () => {
        const mobileMenu = document.querySelector('.mobile-menu');
        const hamburger = document.querySelector('.hamburger');
        const isActive = mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active', isActive);
        hamburger.setAttribute('aria-expanded', isActive);
        hamburger.setAttribute('aria-label', isActive ? 'Close navigation menu' : 'Open navigation menu');
        mobileMenu.classList.toggle('hidden', !isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    };

    // Hide Mobile Menu on Outside Click
    document.addEventListener('click', (event) => {
        const mobileMenu = document.querySelector('.mobile-menu');
        const hamburger = document.querySelector('.hamburger');
        const isMenuActive = mobileMenu.classList.contains('active');
        const clickedInsideMenu = mobileMenu.contains(event.target);
        const clickedHamburger = hamburger.contains(event.target);

        if (isMenuActive && !clickedInsideMenu && !clickedHamburger) {
            toggleMenu();
        }
    }, { passive: true });

    // Close Mobile Menu on Resize to Desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && document.querySelector('.mobile-menu').classList.contains('active')) {
            toggleMenu();
        }
    }, { passive: true });

    // Smooth Scrolling and Active Navigation
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"], .mobile-menu a[href^="#"]');
    const sections = document.querySelectorAll('section[id], header[id]');

    const updateActiveNav = () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 60) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('font-bold', 'text-orange-600');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('font-bold', 'text-orange-600');
            }
        });
    };

    navLinks.forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(anchor.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
            if (document.querySelector('.mobile-menu').classList.contains('active')) {
                toggleMenu();
            }
        }, { passive: true });
    });

    // Debounced Scroll Event for Active Navigation
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNav, 100);
    }, { passive: true });

    // Navigation Scroll Effect (Hide/Show on Scroll)
    let lastScrollTop = 0;
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > lastScrollTop && currentScroll > 0) {
            nav.style.transform = 'translateY(-100%)';
        } else if (currentScroll < lastScrollTop) {
            nav.style.transform = 'translateY(0)';
        }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        if (currentScroll === 0) {
            nav.style.transform = 'translateY(0)';
        }
    }, { passive: true });

    // Modal Functions
    window.openModal = () => {
        const modal = document.getElementById('contactModal');
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        const firstInput = document.getElementById('contactName');
        firstInput.focus();

        const focusableElements = modal.querySelectorAll('input, button, [tabindex="0"]');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
    };

    window.openModalWithService = (service) => {
        openModal();
        document.getElementById('contactService').value = service;
    };

    window.closeModal = () => {
        const modal = document.getElementById('contactModal');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.getElementById('contactForm').reset();
        document.getElementById('contactService').value = '';
        document.getElementById('form-response').classList.add('hidden');
        document.querySelectorAll('.error-message').forEach(el => el.classList.add('hidden'));
    };

    // Close Modal on Outside Click
    window.addEventListener('click', (event) => {
        if (event.target === document.getElementById('contactModal')) {
            closeModal();
        }
    }, { passive: true });

    // Close Modal on Escape Key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    }, { passive: true });

    // Back to Top Button
    const backToTopButton = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        backToTopButton.classList.toggle('opacity-100', window.scrollY > 400);
        backToTopButton.classList.toggle('opacity-0', window.scrollY <= 400);
    }, { passive: true });

    window.scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Form Validation and Submission
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('.form-input');

    const validateInput = (input, regex, errorId, errorMessage) => {
        const isValid = regex.test(input.value.trim());
        const errorElement = document.getElementById(errorId);
        errorElement.classList.toggle('hidden', isValid);
        errorElement.textContent = isValid ? '' : errorMessage;
        return isValid;
    };

    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const validations = {
                contactName: { regex: /.+/, errorId: 'contactNameError', message: 'Please enter your name' },
                contactPhone: { regex: /^\d{10}$/, errorId: 'contactPhoneError', message: 'Please enter a valid 10-digit phone number' },
                contactEmail: { regex: /^\S+@\S+\.\S+$/, errorId: 'contactEmailError', message: 'Please enter a valid email address' },
                contactMobile: { regex: /^\d{10,15}$/, errorId: 'contactMobileError', message: 'Please enter a valid mobile number (10-15 digits)' }
            };
            const validation = validations[input.id];
            if (validation) validateInput(input, validation.regex, validation.errorId, validation.message);
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('contactName');
        const phone = document.getElementById('contactPhone');
        const email = document.getElementById('contactEmail');
        const mobile = document.getElementById('contactMobile');
        const service = document.getElementById('contactService');

        const isValid = [
            validateInput(name, /.+/, 'contactNameError', 'Please enter your name'),
            validateInput(phone, /^\d{10}$/, 'contactPhoneError', 'Please enter a valid 10-digit phone number'),
            validateInput(email, /^\S+@\S+\.\S+$/, 'contactEmailError', 'Please enter a valid email address'),
            validateInput(mobile, /^\d{10,15}$/, 'contactMobileError', 'Please enter a valid mobile number (10-15 digits)')
        ].every(Boolean);

        if (!isValid) return;

        try {
            await emailjs.send('service_faztaf9', 'template_kvs7gzx', {
                name: name.value.trim(),
                phone: phone.value.trim(),
                email: email.value.trim(),
                mobile: mobile.value.trim(),
                service: service.value || 'General Inquiry',
                message: `Inquiry for ${service.value || 'General Inquiry'} via contact form`,
                time: new Date().toLocaleString()
            });
            document.getElementById('form-response').classList.remove('hidden');
            form.reset();
            document.getElementById('contactService').value = '';
            inputs.forEach(input => input.dispatchEvent(new Event('input')));
        } catch (error) {
            console.error('EmailJS Error:', error);
            alert('Failed to send message. Please check your connection and try again.');
        }
    });

    // Image Error Handling
    document.querySelectorAll('img').forEach(img => {
        img.onerror = () => {
            console.warn(`Image failed to load: ${img.src}`);
            img.src = 'img/placeholder.jpg';
            img.alt = 'Image not available';
        };
    });
});

// Alpine.js Accordion Data
document.addEventListener('alpine:init', () => {
    console.log('Alpine.js initialized for accordion');
    Alpine.data('accordionServiceData', () => ({
        open: null,
        categories: [
            { 
                name: 'False Ceilings', 
                icon: 'fas fa-home', // Fallback icon for testing
                image: '/img/false-ceiling.jpg', 
                items: ['Gypsum Ceiling', 'POP Ceiling', 'PVC Ceiling', 'Metal Ceiling', 'Vox Ceiling', 'Glass Ceiling', 'Coffered Ceiling', 'Beamed Ceiling', 'Tray Ceiling', 'Vaulted Ceiling', 'Cove Ceiling', 'Wooden Ceiling'] 
            },
            { 
                name: 'Flooring', 
                icon: 'fas fa-home', // Fallback icon for testing
                image: '/img/flooring.jpg', 
                items: ['Tiles', 'Granite', 'Wooden Flooring', 'HPL Flooring', 'Vinyl Flooring', 'Rubber Flooring', 'Grass Flooring'] 
            },
            { 
                name: 'Wall Decors', 
                icon: 'fas fa-home', // Fallback icon for testing
                image: '/img/wall-decor.jpg', 
                items: ['PVC', 'Wallpaper', 'UV Marble Sheet', 'Louvres', 'Fluted Panel', 'Modelling Bit', 'Sumo Fluted Panel', 'WPC Louvers', 'PU Stone', 'Charcoal'] 
            },
            { 
                name: 'Wooden Work', 
                icon: 'fas fa-home', // Fallback icon for testing
                image: '/img/wooden-work.jpg', 
                items: ['Master Bed', 'Wardrobe & Glass Wardrobe', 'Studies Table', 'TV Unit', 'Dressing Unit', 'Counter Basin', 'Door & Door Panelling', 'Designer Sofa', 'Office Counter'] 
            },
            { 
                name: 'Windows', 
                icon: 'fas fa-home', // Fallback icon for testing
                image: '/img/windows.jpg', 
                items: ['UPVC Windows', 'Aluminium & Powder Coated', 'Domal'] 
            },
            { 
                name: 'Modular Kitchen & More', 
                icon: 'fas fa-home', // Fallback icon for testing
                image: '/img/modular-kitchen.jpg', 
                items: ['Modular Kitchen', 'ACP Work', 'Tuffen Glass'] 
            },
            { 
                name: 'Interior Design', 
                icon: 'fas fa-home', // Fallback icon for testing
                image: '/img/interior-design.jpg', 
                items: ['Home Interior', 'Office Interior', 'Shop Interior', 'Banquet Interior', 'Hotel Interior'] 
            }
        ],
        init() {
            console.log('accordionServiceData initialized with categories:', this.categories);
            this.categories.forEach(category => {
                if (!category.icon || !category.icon.startsWith('fas fa-')) {
                    console.warn(`Invalid icon for ${category.name}: ${category.icon}. Using fallback.`);
                    category.icon = 'fas fa-home';
                }
            });
            if (!this.categories || this.categories.length === 0) {
                console.warn('No categories available for accordion.');
            }
        }
    }));
});

///Added SVG error handling in the DOMContentLoaded
document.querySelectorAll('svg path').forEach(path => {
    try {
        const d = path.getAttribute('d');
        if (d && d.includes('Mppercase')) {
            console.warn('Invalid SVG path detected:', d);
            path.setAttribute('d', 'M0 0'); // Fallback to empty path
        }
    } catch (err) {
        console.error('Error processing SVG path:', err);
    }
});
