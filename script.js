document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('#vote-button');
    const resetButton = document.getElementById('reset-votes');

    elements.forEach(element => {
        element.addEventListener('click', () => handleElementClick(element, elements));
    });

    if (resetButton) {
        resetButton.addEventListener('click', () => resetAllVotes(elements));
    }
});

function handleElementClick(element, elements) {
    if (element.classList.contains('dark:bg-white')) {
        deselectElement(element);
    } else {
        selectElement(element);
    }
    adjustAllSpikeHeights(elements);
}

function resetElement(element) {
    element.classList.remove('dark:bg-white', 'dark:text-slate-900');
    element.classList.add('dark:bg-slate-700', 'hover:dark:bg-slate-600', 'dark:text-white');
}

function deselectElement(element) {
    resetElement(element);
}

function selectElement(element) {
    element.classList.remove('hover:dark:bg-slate-600', 'dark:bg-slate-700', 'dark:text-white');
    element.classList.add('dark:bg-white', 'dark:text-slate-900');
}

function resetAllVotes(elements) {
    elements.forEach(element => {
        resetElement(element);
        const parent = element.parentElement;
        if (parent) {
            const spikeDiv = parent.querySelector('.spike');
            if (spikeDiv) {
                spikeDiv.style.height = '5px';
                spikeDiv.style.backgroundColor = ''; // Reset color
            }
        }
    });
    adjustAllSpikeHeights(elements);
}

function adjustAllSpikeHeights(elements) {
    const selectedElements = Array.from(elements).filter(el => el.classList.contains('dark:bg-white'));
    const totalSelected = selectedElements.length;
    const maxHeight = 224;
    const minHeight = 20;
    const colors = ['#ab3131', '#ede0a6', '#799163', '#507b58']; // Define your color values here

    elements.forEach(element => {
        const parent = element.parentElement;
        if (parent) {
            const spikeDiv = parent.querySelector('.spike');
            if (spikeDiv) {
                if (element.classList.contains('dark:bg-white')) {
                    const height = Math.max(minHeight, maxHeight / totalSelected);
                    spikeDiv.style.height = `${height}px`;

                    // Calculate color index based on height
                    const colorIndex = Math.floor((height - minHeight) / (maxHeight - minHeight) * (colors.length - 1));
                    spikeDiv.style.backgroundColor = colors[colorIndex];
                } else {
                    spikeDiv.style.height = '20px'; // Ensure minimum height is 20px
                    spikeDiv.style.backgroundColor = ''; // Reset color
                }
            }
        }
    });
}