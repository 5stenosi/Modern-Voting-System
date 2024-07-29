document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.hover\\:dark\\:bg-slate-600');

    elements.forEach(element => {
        element.addEventListener('click', () => handleElementClick(element, elements));
    });
});

function handleElementClick(element, elements) {
    if (element.classList.contains('dark:bg-white')) {
        resetElement(element);
    } else {
        resetAllElements(elements, element);
        selectElement(element);
    }
}

function resetElement(element) {
    element.classList.remove('dark:bg-white', 'dark:text-slate-900');
    element.classList.add('dark:bg-slate-700', 'hover:dark:bg-slate-600', 'dark:text-white');
    adjustSpikeHeight(element, 'h-5');
}

function resetAllElements(elements, selectedElement) {
    elements.forEach(el => {
        if (el !== selectedElement) {
            resetElement(el);
        }
    });
}

function selectElement(element) {
    element.classList.remove('hover:dark:bg-slate-600', 'dark:bg-slate-700', 'dark:text-white');
    element.classList.add('dark:bg-white', 'dark:text-slate-900');
    adjustSpikeHeight(element, 'h-56');
}

function adjustSpikeHeight(element, heightClass) {
    const parent = element.parentElement;
    if (parent) {
        const spikeDiv = parent.querySelector('.spike');
        if (spikeDiv) {
            spikeDiv.classList.remove('h-5', 'h-56');
            spikeDiv.classList.add(heightClass);
            adjustSpikeColor(spikeDiv, heightClass);
        }
    }
}

function adjustSpikeColor(spikeDiv, heightClass) {
    const heightValue = parseInt(heightClass.split('-')[1]);
    const colors = [
        '#ab3131',    // Light Red
        '#ede0a6',    // Yellow
        '#799163',    // Light Green
        '#507b58'     // Green
    ];

    const maxHeight = 56;
    const minHeight = 5;
    const step = (maxHeight - minHeight) / (colors.length - 1);
    let colorIndex = Math.floor((heightValue - minHeight) / step);
    colorIndex = Math.min(colorIndex, colors.length - 1); // Ensure index is within bounds
    spikeDiv.style.backgroundColor = colors[colorIndex];
}
