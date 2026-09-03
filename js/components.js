export const createCapabilityItem = (data, index) => {
    return `
        <div class="capability-item ${index === 0 ? 'active' : ''}" data-index="${index}" role="listitem" tabindex="0">
            <h3>${data.title}</h3>
            <p>${data.desc}</p>
        </div>
    `;
};

export const createSolutionTab = (data, index) => {
    return `
        <button class="solution-tab ${data.active ? 'active' : ''}" 
            role="tab" 
            aria-selected="${data.active ? 'true' : 'false'}" 
            aria-controls="solution-${index}"
            id="tab-${index}"
            data-target="solution-${index}">
            ${data.title}
        </button>
    `;
};

export const createSolutionPanel = (data, index) => {
    return `
        <div class="solution-panel ${data.active ? 'active' : ''}" 
            id="solution-${index}" 
            role="tabpanel" 
            aria-labelledby="tab-${index}"
            ${data.active ? '' : 'hidden'}>
            <div class="solution-content">
                <h4>${data.title}</h4>
                <p>${data.desc}</p>
            </div>
            <div class="solution-visual map-visual-container" aria-hidden="true">
                <div class="map-overlay">
                    <div class="coordinate-tag">LAT: 40.7128 | LNG: -74.0060</div>
                    <div class="node-point"></div>
                </div>
            </div>
        </div>
    `;
};

export const createExperienceNode = (data) => {
    return `
        <article class="experience-node align-${data.align}">
            <div class="exp-content card">
                <span class="tag mb-2">${data.org}</span>
                <h4>${data.role}</h4>
                <p>${data.desc}</p>
            </div>
            <div class="exp-line" aria-hidden="true">
                <div class="node-point"></div>
            </div>
            <div class="exp-visual" aria-hidden="true">
                <div class="bg-map-pattern"></div>
            </div>
        </article>
    `;
};

export const createProcessFlow = (steps) => {
    return `
        <div class="process-flow" role="list">
            ${steps.map((step, index) => `
                <div class="process-step" role="listitem">
                    <div class="step-node" aria-hidden="true"></div>
                    <span class="step-label">${step}</span>
                </div>
                ${index < steps.length - 1 ? '<div class="step-connector" aria-hidden="true"></div>' : ''}
            `).join('')}
        </div>
    `;
};
