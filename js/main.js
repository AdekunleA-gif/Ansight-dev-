// Ansight Main JavaScript - Self-contained & CORS-safe for file:/// and HTTP environments

document.addEventListener('DOMContentLoaded', () => {
    // 1. Enable JS animations gracefully
    document.documentElement.classList.add('js-ready');

    // 2. Header Scroll State
    const header = document.querySelector('.site-header');
    const updateHeaderScroll = () => {
        if (!header) return;
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', updateHeaderScroll, { passive: true });
    updateHeaderScroll();

    // 3. Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', String(!isExpanded));
            mainNav.classList.toggle('is-open');
        });

        // Close mobile menu on click of nav link
        mainNav.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-item')) {
                mainNav.classList.remove('is-open');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // 4. Smooth Scrolling with Header Offset
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        const targetId = anchor.getAttribute('href');
        if (targetId === '#' || !targetId) return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            e.preventDefault();
            const headerHeight = header ? header.offsetHeight + 24 : 80;
            const elementPosition = targetEl.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: Math.max(0, offsetPosition),
                behavior: 'smooth'
            });

            // Accessibility focus
            targetEl.setAttribute('tabindex', '-1');
            targetEl.focus({ preventScroll: true });
        }
    });

    // 5. ScrollSpy for Active Navigation Tab Highlighting
    const navItems = document.querySelectorAll('.nav-links .nav-item');
    const sections = Array.from(navItems).map(item => {
        const id = item.getAttribute('href');
        return document.querySelector(id);
    }).filter(Boolean);

    const updateScrollSpy = () => {
        const scrollPos = window.scrollY + 180;
        let currentSectionId = '';

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentSectionId = '#' + section.id;
            }
        });

        if (!currentSectionId && window.scrollY < 200) {
            currentSectionId = '#home';
        }

        if (currentSectionId) {
            navItems.forEach(item => {
                if (item.getAttribute('href') === currentSectionId) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    };

    window.addEventListener('scroll', updateScrollSpy, { passive: true });
    updateScrollSpy();

    // 6. Intersection Observer for Scroll Reveals
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -40px 0px',
            threshold: 0.1
        };

        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => el.classList.add('active'));
    }

    // 7. Hero Slideshow — 20 second auto-advance with dot indicators
    const slides = document.querySelectorAll('.hero-slide');
    const dots   = document.querySelectorAll('.hero-dot');
    const SLIDE_DURATION = 20000; // 20 seconds
    let currentSlide = 0;
    let slideshowTimer = null;

    function goToSlide(index) {
        // Remove active from old slide & dot
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        dots[currentSlide].setAttribute('aria-selected', 'false');

        // Set new index
        currentSlide = (index + slides.length) % slides.length;

        // Activate new slide & dot
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        dots[currentSlide].setAttribute('aria-selected', 'true');
    }

    function startSlideshow() {
        if (slideshowTimer) clearInterval(slideshowTimer);
        slideshowTimer = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, SLIDE_DURATION);
    }

    // Dot click — manual navigation resets the timer
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            goToSlide(i);
            startSlideshow(); // restart timer after manual click
        });
    });

    // Start auto-advance
    if (slides.length > 1) startSlideshow();
});

