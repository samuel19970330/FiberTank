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

    // --- Active Header on Scroll ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
        }
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

    // Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Here you would typically send data to backend or use a service like Formspree
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Enviando...';
            btn.style.opacity = '0.7';

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
        const fullDesc = card.querySelector('.product-card__content-hidden') ?
            card.querySelector('.product-card__content-hidden').innerHTML :
            '<p>Información detallada no disponible.</p>';
        const specsHTML = card.querySelector('.product-card__specs').innerHTML;

        // Populate Modal
        modalImage.src = imgSrc;
        modalTitle.innerText = title;
        modalDesc.innerText = desc;
        modalFullDesc.innerHTML = fullDesc;
        modalSpecs.innerHTML = `<ul class="list-none">${specsHTML}</ul>`;

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
