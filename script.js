(function () {
    // Function to register Alpine.js component
    document.addEventListener('alpine:init', () => {
        Alpine.data('accordionServiceData', () => ({
          open: null,
          categories: [
            {
              name: 'False Ceilings',
              icon: 'fas fa-home',
              items: ['Gypsum Ceiling', 'POP Ceiling', 'PVC Ceiling']
            },
            {
              name: 'Flooring',
              icon: 'fas fa-ruler-combined',
              items: ['Tiles', 'Granite', 'Wooden Flooring']
            },
            {
              name: 'Wall Decors',
              icon: 'fas fa-paint-roller',
              items: ['PVC', 'Wallpaper', 'UV Marble Sheet']
            }
          ],
          toggleAccordion(index) {
            this.open = this.open === index ? null : index;
          },
          openModalWithService(service) {
            alert('Quote request for: ' + service);
          }
        }));
      });
    

    // DOMContentLoaded for other initialization
    document.addEventListener('DOMContentLoaded', () => {
        // Check if Alpine.js is loaded
        if (typeof Alpine === 'undefined') {
            console.error('Alpine.js is not loaded. Please check the CDN or script inclusion.');
            renderFallback('Alpine.js failed to load. Please check the CDN.');
        } else {
            console.log('Alpine.js is loaded successfully.');
        }

        // Confirm Alpine.js initialization
        document.addEventListener('alpine:initialized', () => {
            console.log('Alpine.js fully initialized.');
        });

        // Initialize EmailJS
        if (typeof emailjs !== 'undefined') {
            emailjs.init("Nhyhvf08MTPH-yDBx");
            console.log('EmailJS initialized');
        } else {
            console.warn('EmailJS not loaded');
        }

        // Initialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 120,
                easing: 'ease-out-quart'
            });
            console.log('AOS initialized');
        } else {
            console.warn('AOS library not loaded');
        }

        // Initialize Lightbox
        if (typeof lightbox !== 'undefined') {
            lightbox.option({
                resizeDuration: 200,
                wrapAround: true,
                disableScrolling: true,
                fitImagesInViewport: true,
                albumLabel: 'Image %1 of %2',
                fadeDuration: 400
            });
            console.log('Lightbox initialized');
        } else {
            console.warn('Lightbox not loaded');
        }

        // Dynamic Copyright Year
        const yearElement = document.getElementById('year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        } else {
            console.warn('Year element not found');
        }

        // Hero Slideshow
        const slides = document.querySelectorAll('.slide');
        let currentSlide = 0;
        let slideInterval = setInterval(nextSlide, 5000);

        function nextSlide() {
            slides[currentSlide].classList.remove('active', 'opacity-100');
            slides[currentSlide].classList.add('opacity-0');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.remove('opacity-0');
            slides[currentSlide].classList.add('active', 'opacity-100');
        }

        if (slides.length > 0) {
            slides[0].classList.add('active', 'opacity-100');
            const slideshow = document.querySelector('.slideshow');
            if (slideshow) {
                slideshow.addEventListener('mouseenter', () => clearInterval(slideInterval));
                slideshow.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 5000));
                console.log('Slideshow initialized with', slides.length, 'slides');
            } else {
                console.warn('Slideshow container not found');
            }
        } else {
            console.warn('No slideshow slides found');
        }

        // Hamburger Menu Toggle
        window.toggleMenu = () => {
            const hamburger = document.querySelector('.hamburger');
            const mobileMenu = document.querySelector('.mobile-menu');
            if (!hamburger || !mobileMenu) {
                console.error('Hamburger or mobile menu element not found');
                return;
            }

            const isOpen = hamburger.getAttribute('data-menu-open') === 'true';
            hamburger.setAttribute('data-menu-open', !isOpen);
            mobileMenu.setAttribute('data-menu-open', !isOpen);
            hamburger.setAttribute('aria-expanded', !isOpen);

            if (!isOpen) {
                mobileMenu.style.display = 'block';
                hamburger.setAttribute('aria-label', 'Close navigation menu');
                document.body.style.overflow = 'hidden';
                mobileMenu.querySelector('a').focus();
                console.log('Mobile menu opened');
            } else {
                mobileMenu.style.display = 'none';
                hamburger.setAttribute('aria-label', 'Open navigation menu');
                document.body.style.overflow = '';
                hamburger.focus();
                console.log('Mobile menu closed');
            }
        };

        // Hide Mobile Menu on Outside Click
        document.addEventListener('click', (event) => {
            const mobileMenu = document.querySelector('.mobile-menu');
            const hamburger = document.querySelector('.hamburger');
            if (!mobileMenu || !hamburger) return;

            const isMenuOpen = mobileMenu.getAttribute('data-menu-open') === 'true';
            const clickedInsideMenu = mobileMenu.contains(event.target);
            const clickedHamburger = hamburger.contains(event.target);

            if (isMenuOpen && !clickedInsideMenu && !clickedHamburger) {
                window.toggleMenu();
                console.log('Mobile menu closed due to outside click');
            }
        });

        // Close Mobile Menu on Resize to Desktop
        window.addEventListener('resize', () => {
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu && window.innerWidth >= 768 && mobileMenu.getAttribute('data-menu-open') === 'true') {
                window.toggleMenu();
                console.log('Mobile menu closed on resize to desktop');
            }
        });

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
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu && mobileMenu.getAttribute('data-menu-open') === 'true') {
                    window.toggleMenu();
                }
            });
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
        if (nav) {
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
        } else {
            console.warn('Navigation element not found');
        }

        // Modal Functions
        window.openModal = () => {
            const modal = document.getElementById('contactModal');
            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                modal.setAttribute('aria-hidden', 'false');
                const firstInput = document.getElementById('contactName');
                if (firstInput) firstInput.focus();

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
                console.log('Contact modal opened');
            } else {
                console.error('Contact modal not found');
            }
        };

        window.openModalWithService = (service) => {
            const modal = document.getElementById('contactModal');
            const contactService = document.getElementById('contactService');
            if (modal && contactService) {
                contactService.value = service;
                window.openModal();
                console.log('Opened modal with service:', service);
            } else {
                console.error('Modal or contactService input not found');
            }
        };

        window.closeModal = () => {
            const modal = document.getElementById('contactModal');
            const form = document.getElementById('contactForm');
            const formResponse = document.getElementById('form-response');
            if (modal && form && formResponse) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                modal.setAttribute('aria-hidden', 'true');
                form.reset();
                document.getElementById('contactService').value = '';
                formResponse.classList.add('hidden');
                document.querySelectorAll('.error-message').forEach(el => el.classList.add('hidden'));
                console.log('Contact modal closed');
            } else {
                console.error('Modal, form, or form-response not found');
            }
        };

        // Close Modal on Outside Click
        window.addEventListener('click', (event) => {
            const modal = document.getElementById('contactModal');
            if (event.target === modal) {
                window.closeModal();
            }
        });

        // Close Modal on Escape Key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                window.closeModal();
            }
        });

        // Back to Top Button
        const backToTopButton = document.getElementById('backToTop');
        if (backToTopButton) {
            window.addEventListener('scroll', () => {
                backToTopButton.classList.toggle('opacity-100', window.scrollY > 400);
                backToTopButton.classList.toggle('opacity-0', window.scrollY <= 400);
            }, { passive: true });
        } else {
            console.warn('Back to top button not found');
        }

        window.scrollToTop = () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            console.log('Scrolled to top');
        };

        // Form Validation and Submission
        const form = document.getElementById('contactForm');
        if (form) {
            const inputs = form.querySelectorAll('.form-input');

            const validateInput = (input, regex, errorId, errorMessage) => {
                const isValid = regex.test(input.value.trim());
                const errorElement = document.getElementById(errorId);
                if (errorElement) {
                    errorElement.classList.toggle('hidden', isValid);
                    errorElement.textContent = isValid ? '' : errorMessage;
                }
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

                const submitBtn = document.getElementById('submitBtn');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';

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
                    setTimeout(() => {
                        window.closeModal();
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Send Message';
                    }, 2000);
                    console.log('Form submitted successfully');
                } catch (error) {
                    console.error('EmailJS Error:', error);
                    document.getElementById('form-response').classList.remove('hidden');
                    document.getElementById('form-response').classList.add('text-red-500');
                    document.getElementById('form-response').textContent = 'Failed to send message. Please try again.';
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                }
            });
        } else {
            console.warn('Contact form not found');
        }

        // Image Error Handling
        document.querySelectorAll('img').forEach(img => {
            img.onerror = () => {
                console.warn(`Image failed to load: ${img.src}`);
                img.src = 'img/home.jpeg';
                img.alt = 'Image not available';
            };
        });

        // SVG Error Handling
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
    });
})();
