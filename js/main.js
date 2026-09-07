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
                header.style.background = 'rgba(10, 15, 28, 0.95)';
                header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
            } else {
                header.style.background = 'rgba(10, 15, 28, 0.85)';
                header.style.boxShadow = 'none';
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

    // 4. Render Capabilities (Split Screen UX)
    const capabilitiesList = document.getElementById('capabilities-list');
    if (capabilitiesList) {
        capabilitiesList.innerHTML = capabilitiesData.map((data, idx) => createCapabilityItem(data, idx)).join('');
        
        const items = document.querySelectorAll('.capability-item');
        items.forEach(item => {
            const activateItem = () => {
                items.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            };
            item.addEventListener('mouseenter', activateItem);
            item.addEventListener('focus', activateItem);
        });
    }

    // 5. Render Solutions (Tabs UX)
    const solutionsTabs = document.getElementById('solutions-tabs');
    const solutionsContent = document.getElementById('solutions-content');
    if (solutionsTabs && solutionsContent) {
        solutionsTabs.innerHTML = solutionsData.map((data, idx) => createSolutionTab(data, idx)).join('');
        solutionsContent.innerHTML = solutionsData.map((data, idx) => createSolutionPanel(data, idx)).join('');
        
        const tabs = document.querySelectorAll('.solution-tab');
        const panels = document.querySelectorAll('.solution-panel');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
                panels.forEach(p => { p.classList.remove('active'); p.hidden = true; });
                
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
                const targetPanel = document.getElementById(tab.dataset.target);
                targetPanel.classList.add('active');
                targetPanel.hidden = false;
            });
        });
    }

    // 6. Render Experience (Timeline UX)
    const experienceTimeline = document.getElementById('experience-timeline');
    if (experienceTimeline) {
        experienceTimeline.innerHTML = experienceData.map(data => createExperienceNode(data)).join('');
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
});
