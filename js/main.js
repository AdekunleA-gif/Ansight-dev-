// Ansight Main JavaScript — Premium Art-Directed Edition
// Self-contained & CORS-safe for file:/// and HTTP environments

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

    // 7. SVG Line Draw Animation on Scroll
    const drawLines = document.querySelectorAll('.svg-draw-line');
    if (drawLines.length > 0 && 'IntersectionObserver' in window) {
        // Measure actual path lengths and set dasharray/offset
        drawLines.forEach(line => {
            let length;
            if (line.getTotalLength) {
                length = line.getTotalLength();
            } else {
                // Fallback for <line> elements
                const x1 = parseFloat(line.getAttribute('x1') || 0);
                const y1 = parseFloat(line.getAttribute('y1') || 0);
                const x2 = parseFloat(line.getAttribute('x2') || 0);
                const y2 = parseFloat(line.getAttribute('y2') || 0);
                length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            }
            line.style.strokeDasharray = length;
            line.style.strokeDashoffset = length;
        });

        const drawObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Stagger draw with delays
                    const lines = entry.target.querySelectorAll('.svg-draw-line');
                    lines.forEach((line, i) => {
                        setTimeout(() => {
                            line.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1)';
                            line.style.strokeDashoffset = '0';
                        }, i * 150);
                    });
                    drawObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        // Observe parent containers of draw lines
        const heroSvg = document.querySelector('.hero-svg-canvas');
        if (heroSvg) {
            drawObserver.observe(heroSvg);
        }
    }

    // 8. Pipeline connector draw animation
    const pipelineSection = document.querySelector('#process');
    if (pipelineSection && 'IntersectionObserver' in window) {
        const pipelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const connectors = pipelineSection.querySelectorAll('.pipeline-connector line');
                    connectors.forEach((line, i) => {
                        const length = 40;
                        line.style.strokeDasharray = length;
                        line.style.strokeDashoffset = length;
                        setTimeout(() => {
                            line.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)';
                            line.style.strokeDashoffset = '0';
                        }, 400 + i * 300);
                    });
                    pipelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        pipelineObserver.observe(pipelineSection);
    }

    // 9. Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        // Immediately show all reveals
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
        // Immediately draw all lines
        document.querySelectorAll('.svg-draw-line').forEach(line => {
            line.style.strokeDashoffset = '0';
            line.style.transition = 'none';
        });
    }

    // 10. Contact Form AJAX Submission (Web3Forms)
    const contactForm = document.querySelector('.contact-form-card');
    if (contactForm) {
        let statusMessage = contactForm.querySelector('.form-status');
        if (!statusMessage) {
            statusMessage = document.createElement('div');
            statusMessage.className = 'form-status';
            statusMessage.style.display = 'none';
            statusMessage.style.marginTop = 'var(--space-4)';
            statusMessage.style.padding = 'var(--space-3) var(--space-4)';
            statusMessage.style.borderRadius = 'var(--radius-md)';
            statusMessage.style.fontSize = 'var(--font-size-sm)';
            statusMessage.style.textAlign = 'center';
            statusMessage.style.fontWeight = '500';
            statusMessage.setAttribute('role', 'alert');
            contactForm.appendChild(statusMessage);
        }

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.textContent : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }
            statusMessage.style.display = 'none';

            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                });

                if (response.status === 200) {
                    contactForm.reset();
                    statusMessage.textContent = 'Thank you! Your message has been sent successfully.';
                    statusMessage.style.display = 'block';
                    statusMessage.style.color = '#2d6a4f';
                    statusMessage.style.backgroundColor = 'rgba(45, 106, 79, 0.1)';
                    statusMessage.style.border = '1px solid rgba(45, 106, 79, 0.25)';
                } else {
                    const data = await response.json().catch(() => null);
                    statusMessage.textContent = (data && data.message) ? data.message : 'Something went wrong. Please try again.';
                    statusMessage.style.display = 'block';
                    statusMessage.style.color = '#b91c1c';
                    statusMessage.style.backgroundColor = 'rgba(185, 28, 28, 0.1)';
                    statusMessage.style.border = '1px solid rgba(185, 28, 28, 0.25)';
                }
            } catch (error) {
                statusMessage.textContent = 'Something went wrong. Please check your connection and try again.';
                statusMessage.style.display = 'block';
                statusMessage.style.color = '#b91c1c';
                statusMessage.style.backgroundColor = 'rgba(185, 28, 28, 0.1)';
                statusMessage.style.border = '1px solid rgba(185, 28, 28, 0.25)';
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            }
        });
    }
});
