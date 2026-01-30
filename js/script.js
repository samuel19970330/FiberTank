// Main Interactions
document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu ---
    const navToggle = document.querySelector('.nav__toggle');
    const nav = document.querySelector('#nav');
    const navLinks = document.querySelectorAll('.nav__link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    });

    // --- Scroll Progress Bar ---
    const scrollProgress = document.querySelector('.scroll-progress');

    function updateScrollProgress() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = scrolled + '%';
        }
    }

    // --- Active Navigation Highlighting ---
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                const sectionId = section.getAttribute('id');
                // Validate section ID (only alphanumeric and hyphens)
                if (sectionId && /^[a-zA-Z0-9-]+$/.test(sectionId)) {
                    current = sectionId;
                }
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            // Validate href format
            if (href && href.startsWith('#') && href === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // --- Back to Top Button ---
    const backToTopBtn = document.querySelector('.back-to-top');

    function updateBackToTop() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Parallax Effect on Hero (DISABLED - causing overlap) ---
    // const hero = document.querySelector('.hero');

    // function updateParallax() {
    //     const scrolled = window.pageYOffset;
    //     if (hero && scrolled < window.innerHeight) {
    //         hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    //     }
    // }

    // --- Active Header on Scroll ---
    const header = document.querySelector('.header');

    function updateHeader() {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
        }
    }

    // Combine all scroll events for better performance
    window.addEventListener('scroll', () => {
        updateScrollProgress();
        updateActiveNav();
        updateBackToTop();
        // updateParallax(); // Disabled - causing overlap
        updateHeader();
    });

    // --- FAQ Accordion ---
    const accordionHeaders = document.querySelectorAll('.accordion__header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const body = header.nextElementSibling;
            header.classList.toggle('active');

            if (header.classList.contains('active')) {
                body.style.maxHeight = body.scrollHeight + 'px';
            } else {
                body.style.maxHeight = 0;
            }

            // Close other items (optional, keeping multiple open is usually friendlier)
            /* 
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header && otherHeader.classList.contains('active')) {
                    otherHeader.classList.remove('active');
                    otherHeader.nextElementSibling.style.maxHeight = 0;
                }
            }); 
            */
        });
    });

    // --- Anime.js Animations ---

    // Hero Animations
    anime({
        targets: '.hero__content .anime-fade-up',
        translateY: [50, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 1200,
        delay: 300
    });

    anime({
        targets: '.hero__title',
        translateY: [30, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 1000,
        delay: 500
    });

    anime({
        targets: '.hero__actions .btn',
        translateY: [20, 0],
        opacity: [0, 1],
        easing: 'easeOutQuad',
        duration: 800,
        delay: anime.stagger(200, { start: 1000 })
    });

    // Scroll Observer for Sections
    const observerOptions = {
        threshold: 0.1
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a class to trigger CSS or run animejs
                // Here we run animejs for elements inside

                anime({
                    targets: entry.target,
                    translateY: [50, 0],
                    opacity: [0, 1],
                    easing: 'easeOutQuad',
                    duration: 800,
                    delay: 200 // slight delay
                });

                animateOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.anime-on-scroll').forEach(el => {
        el.style.opacity = 0; // Hide initially
        animateOnScroll.observe(el);
    });

    // --- Animated Statistics Counters ---
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }

    // Observe stat numbers for animation
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const number = entry.target.querySelector('.stat-item__number');
                if (number && number.textContent === '0') {
                    animateCounter(number);
                }
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-item').forEach(item => {
        statObserver.observe(item);
    });

    // Contact Form Handler with Security
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        let lastSubmit = 0;
        const RATE_LIMIT = 5000; // 5 seconds between submissions

        // Input sanitization function
        function sanitizeInput(input) {
            if (typeof input !== 'string') return '';
            return input.replace(/[<>]/g, '').trim();
        }

        // Email validation function
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Rate limiting check
            const now = Date.now();
            if (now - lastSubmit < RATE_LIMIT) {
                alert('Por favor espera unos segundos antes de enviar otro mensaje.');
                return;
            }

            // Get and validate inputs
            const nameInput = contactForm.querySelector('input[name="name"]');
            const emailInput = contactForm.querySelector('input[name="email"]');
            const messageInput = contactForm.querySelector('textarea[name="message"]');

            if (!nameInput || !emailInput || !messageInput) {
                alert('Error: Formulario incompleto');
                return;
            }

            const name = sanitizeInput(nameInput.value);
            const email = sanitizeInput(emailInput.value);
            const message = sanitizeInput(messageInput.value);

            // Validation
            if (name.length < 2) {
                alert('Por favor ingresa un nombre válido (mínimo 2 caracteres)');
                nameInput.focus();
                return;
            }

            if (!validateEmail(email)) {
                alert('Por favor ingresa un email válido');
                emailInput.focus();
                return;
            }

            if (message.length < 10) {
                alert('Por favor ingresa un mensaje más detallado (mínimo 10 caracteres)');
                messageInput.focus();
                return;
            }

            // Update last submit time
            lastSubmit = now;

            // Here you would typically send data to backend or use a service like Formspree
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Enviando...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            // Simulate sending
            setTimeout(() => {
                alert('¡Gracias por tu mensaje! Un asesor se pondrá en contacto contigo pronto.');
                contactForm.reset();
                btn.innerText = 'Mensaje Enviado';
                btn.style.backgroundColor = '#25d366'; // WhatsApp green for success

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.opacity = '1';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // --- Product Modal Logic ---
    const modal = document.getElementById('productModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.querySelector('.modal__close');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalFullDesc = document.getElementById('modalFullDesc');
    const modalSpecs = document.getElementById('modalSpecs');
    const modalCta = document.querySelector('.modal__cta');

    const openModalButtons = document.querySelectorAll('.js-open-modal');

    // Function to open modal
    function openModal(card) {
        // Extract data
        const imgSrc = card.querySelector('.product-card__image img').src;
        const title = card.querySelector('.product-card__title').innerText;
        const desc = card.querySelector('.product-card__desc').innerText;
        const fullDescElement = card.querySelector('.product-card__content-hidden');
        const fullDesc = fullDescElement ? fullDescElement.textContent.trim() : 'Información detallada no disponible.';
        const specsElement = card.querySelector('.product-card__specs');
        const specsHTML = specsElement ? specsElement.innerHTML : '';

        // Populate Modal (using textContent for security)
        modalImage.src = imgSrc;
        modalImage.alt = title;
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        modalFullDesc.textContent = fullDesc;

        // For specs, we sanitize by only allowing <li> elements
        if (specsHTML) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = specsHTML;
            const listItems = tempDiv.querySelectorAll('li');
            const sanitizedList = document.createElement('ul');
            sanitizedList.className = 'list-none';
            listItems.forEach(li => {
                const newLi = document.createElement('li');
                newLi.textContent = li.textContent;
                sanitizedList.appendChild(newLi);
            });
            modalSpecs.innerHTML = '';
            modalSpecs.appendChild(sanitizedList);
        } else {
            modalSpecs.textContent = '';
        }

        // Show Modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // Function to close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event Listeners for triggers
    openModalButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Find closest card parent
            const card = btn.closest('.product-card');
            if (card) {
                openModal(card);
            }
        });
    });

    // Close listeners
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Close modal when clicking Main CTA inside it
    if (modalCta) {
        modalCta.addEventListener('click', () => {
            closeModal();
        });
    }

    // --- Carousel for Raw Materials Section ---
    const carouselTrack = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.carousel__indicator');

    if (carouselTrack && prevBtn && nextBtn) {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.carousel__slide');
        const totalSlides = slides.length;
        let autoRotateInterval;

        // Function to update carousel position
        function updateCarousel() {
            const offset = -currentSlide * 100;
            carouselTrack.style.transform = `translateX(${offset}%)`;

            // Update indicators
            indicators.forEach((indicator, index) => {
                if (index === currentSlide) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }

        // Next slide
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }

        // Previous slide
        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }

        // Event listeners for navigation buttons
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoRotate();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoRotate();
        });

        // Event listeners for indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlide = index;
                updateCarousel();
                resetAutoRotate();
            });
        });

        // Auto-rotate carousel every 5 seconds
        function startAutoRotate() {
            autoRotateInterval = setInterval(nextSlide, 5000);
        }

        function resetAutoRotate() {
            clearInterval(autoRotateInterval);
            startAutoRotate();
        }

        // Start auto-rotation
        startAutoRotate();

        // Pause auto-rotation when hovering over carousel
        const carousel = document.getElementById('materialsCarousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                clearInterval(autoRotateInterval);
            });

            carousel.addEventListener('mouseleave', () => {
                startAutoRotate();
            });
        }
    }
});
