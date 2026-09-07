import { companyInfo, founderInfo, navigation, capabilitiesData, solutionsData, experienceData, processSteps } from './data.js';
import { createCapabilityItem, createSolutionTab, createSolutionPanel, createExperienceNode, createProcessFlow } from './components.js';

document.addEventListener('DOMContentLoaded', () => {
    // 0. Populate Centralized Data Configuration
    const elementsToPopulate = [
        { selector: '[data-config="company-name"]', value: companyInfo.name },
        { selector: '[data-config="company-tagline"]', value: companyInfo.tagline },
        { selector: '[data-config="company-desc"]', value: companyInfo.description },
        { selector: '[data-config="founder-name"]', value: founderInfo.name },
        { selector: '[data-config="founder-role"]', value: founderInfo.role },
        { selector: '[data-config="founder-bio"]', value: founderInfo.bio },
        { selector: '[data-config="company-founded"]', value: companyInfo.founded },
        { selector: '[data-config="company-location"]', value: companyInfo.location },
        { selector: '[data-config="company-naics"]', value: companyInfo.naicsCodes },
        { selector: '[data-config="founder-email"]', value: founderInfo.email },
        { selector: '[data-config="founder-phone"]', value: founderInfo.phone },
    ];
    
    elementsToPopulate.forEach(item => {
        const els = document.querySelectorAll(item.selector);
        els.forEach(el => { el.textContent = item.value; });
    });

    // Populate Dynamic Navigation
    const navContainer = document.querySelector('.nav-links');
    if (navContainer) {
        navContainer.innerHTML = navigation.map(link => 
            `<a href="${link.href}" class="nav-item">${link.label}</a>`
        ).join('');
    }

    // Populate copyright year
    const copyrightEl = document.querySelector('[data-config="copyright"]');
    if (copyrightEl) {
        copyrightEl.innerHTML = `&copy; ${new Date().getFullYear()} ${companyInfo.name}. All rights reserved.`;
    }

    // 1. Header Scroll state
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 2. Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('is-open');
        });

        // Close mobile menu when a nav link is clicked (Bug #11 fix)
        mainNav.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-item')) {
                mainNav.classList.remove('is-open');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // 3. Render Process Flow
    const processContainer = document.getElementById('process-flow-container');
    if (processContainer) {
        processContainer.innerHTML = createProcessFlow(processSteps);
    }

    // 4. Render Capabilities (Grid Layout)
    const capabilitiesList = document.getElementById('capabilities-list');
    if (capabilitiesList) {
        capabilitiesList.innerHTML = capabilitiesData.map((data, idx) => createCapabilityItem(data, idx)).join('');
    }

    // 5. Render Solutions (Grid Layout)
    const solutionsContent = document.getElementById('solutions-content');
    if (solutionsContent) {
        solutionsContent.innerHTML = solutionsData.map((data, idx) => createSolutionPanel(data, idx)).join('');
    }

    // 6. Render Experience (Grid Layout)
    const experienceList = document.getElementById('experience-list');
    if (experienceList) {
        experienceList.innerHTML = experienceData.map((data, idx) => createExperienceNode(data, idx)).join('');
    }

    // 7. Smooth scroll via event delegation (Bug #8 fix)
    // Uses delegation so dynamically-injected nav links are captured
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            target.setAttribute('tabindex', '-1');
            target.focus();
        }
    });

    // 8. Intersection Observer for Scroll Reveals
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    setTimeout(() => {
        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observer.observe(el));
    }, 100);
});
