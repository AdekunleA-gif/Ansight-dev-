export const createCapabilityItem = (data, index) => {
    return `
        <div class="capability-item reveal delay-${index % 3 + 1}" data-index="${index}" role="listitem" tabindex="0">
            <h3 style="color: var(--clr-primary); font-size: var(--font-size-xl); margin-bottom: var(--space-2);">${data.title}</h3>
            <p>${data.desc}</p>
        </div>
    `;
};

// Solution Tabs are no longer needed
export const createSolutionTab = (data, index) => '';

export const createSolutionPanel = (data, index) => {
    return `
        <div class="capability-item reveal delay-${index % 2 + 1}" style="background: rgba(14,165,233,0.05);">
            <h3 style="color: var(--clr-text-primary); margin-bottom: var(--space-2);">${data.title}</h3>
            <p>${data.desc}</p>
        </div>
    `;
};

export const createExperienceNode = (data, index) => {
    return `
        <article class="capability-item reveal delay-${index % 2 + 1}">
            <span class="tag mb-2" style="display: inline-block; padding: 4px 8px; background: rgba(14,165,233,0.1); color: var(--clr-primary); border-radius: 4px; font-size: 0.8rem; text-transform: uppercase;">${data.org}</span>
            <h4 style="margin-bottom: var(--space-2);">${data.role}</h4>
            <p>${data.desc}</p>
        </article>
    `;
};

export const createProcessFlow = (steps) => {
    return `
        <div class="process-flow" role="list">
            ${steps.map((step, index) => `
                <div class="process-step reveal" role="listitem">
                    <div class="step-node" aria-hidden="true"></div>
                    <span class="step-label">${step}</span>
                </div>
                ${index < steps.length - 1 ? '<div class="step-connector" aria-hidden="true"></div>' : ''}
            `).join('')}
        </div>
    `;
};
