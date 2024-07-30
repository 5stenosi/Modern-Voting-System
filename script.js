function handleElementClick(element, elements) {
    if (!element.classList.contains('dark:bg-white')) {
        selectElement(element);
    }
    incrementVotes(element);
    adjustAllSpikeHeights(elements);
}

function incrementVotes(element) {
    let votes = parseInt(element.dataset.votes, 10);
    votes += 1; // Increment by 1
    element.dataset.votes = votes.toString();

    // Update the content of the element with the 'vote-count' class
    const voteCountElement = element.querySelector('.vote-count');
    if (voteCountElement) {
        voteCountElement.textContent = votes.toString();
    }
}

function resetElement(element) {
    element.classList.remove('dark:bg-white', 'dark:text-slate-900');
    element.classList.add('dark:bg-slate-700', 'hover:dark:bg-slate-600', 'dark:text-white');
    element.dataset.votes = '0'; // Reset vote count

    const parent = element.parentElement;
    if (parent) {
        const spikeDiv = parent.querySelector('.spike');
        if (spikeDiv) {
            spikeDiv.style.height = spikeDiv.dataset.originalHeight || '20px';
            spikeDiv.style.backgroundColor = spikeDiv.dataset.originalColor || ''; // Reset color
        }
    }
}

function resetVoteCounts(element) {
    const voteCountElements = element.querySelectorAll('.vote-count');
    voteCountElements.forEach(el => {
        el.textContent = '0';
    });
}

function deselectElement(element) {
    resetElement(element);
}

function selectElement(element) {
    element.classList.remove('hover:dark:bg-slate-600', 'dark:bg-slate-700', 'dark:text-white');
    element.classList.add('dark:bg-white', 'dark:text-slate-900');

    const parent = element.parentElement;
    if (parent) {
        const spikeDiv = parent.querySelector('.spike');
        if (spikeDiv) {
            // Store original height and color
            spikeDiv.dataset.originalHeight = spikeDiv.style.height;
            spikeDiv.dataset.originalColor = spikeDiv.style.backgroundColor;
        }
    }
}

function resetAllVotes(elements) {
    elements.forEach(element => {
        resetElement(element);
        resetVoteCounts(element);
    });
    adjustAllSpikeHeights(elements);
}

function adjustAllSpikeHeights(elements) {
    const selectedElements = Array.from(elements).filter(el => el.classList.contains('dark:bg-white'));
    let maxHeight = getMaxHeight();
    const minHeight = 20;

    if (selectedElements.length === 0) return;

    // Trova l'elemento con il massimo numero di voti
    const maxVotesElement = selectedElements.reduce((maxEl, el) => {
        return parseInt(el.dataset.votes, 10) > parseInt(maxEl.dataset.votes, 10) ? el : maxEl;
    });
    const maxVotes = parseInt(maxVotesElement.dataset.votes, 10);
    selectedElements.forEach(element => {
        const votes = parseInt(element.dataset.votes, 10);
        const height = element === maxVotesElement ? maxHeight : Math.max(minHeight, (votes / maxVotes) * maxHeight);
        const parent = element.parentElement;
        if (parent) {
            const spikeDiv = parent.querySelector('.spike');
            if (spikeDiv) {
                spikeDiv.style.height = `${height}px`;
            }
        }
    });

    // Raggruppa gli elementi per altezza della spike
    const heightGroups = {};
    selectedElements.forEach(element => {
        const parent = element.parentElement;
        if (parent) {
            const spikeDiv = parent.querySelector('.spike');
            if (spikeDiv) {
                const height = parseInt(spikeDiv.style.height, 10);
                if (!heightGroups[height]) {
                    heightGroups[height] = [];
                }
                heightGroups[height].push(spikeDiv);
            }
        }
    });

    // Ordina le altezze in ordine decrescente
    const sortedHeights = Object.keys(heightGroups).map(Number).sort((a, b) => b - a);

    // Assegna i colori in base all'ordine ordinato
    const darkGreen = '#507b58';
    const lightGreen = '#799163';
    const yellow = '#ede0a6';
    sortedHeights.forEach((height, index) => {
        const color = index === 0 ? darkGreen : index === 1 ? lightGreen : index === 2 ? yellow : null;
        if (color) {
            heightGroups[height].forEach(spikeDiv => {
                spikeDiv.style.backgroundColor = color;
            });
        } else {
            heightGroups[height].forEach(spikeDiv => {
                spikeDiv.style.backgroundColor = spikeDiv.dataset.originalColor || ''; // Reset to original color
            });
        }
    });
}

function getMaxHeight() {
    return window.innerWidth <= 1024 ? 112 : 224;
}

document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('#vote-button');
    const resetButton = document.getElementById('reset-votes');

    elements.forEach(element => {
        element.dataset.votes = '0'; // Initialize vote count
        element.addEventListener('click', () => handleElementClick(element, elements));

        // Add 'vote-count' element if it doesn't exist
        if (!element.querySelector('.vote-count')) {
            const voteCountElement = document.createElement('span');
            voteCountElement.classList.add('vote-count');
            voteCountElement.textContent = '0';
            element.appendChild(voteCountElement);
        }
    });

    if (resetButton) {
        resetButton.addEventListener('click', () => resetAllVotes(elements));
    }

    // Add resize event listener
    window.addEventListener('resize', () => adjustAllSpikeHeights(elements));
});