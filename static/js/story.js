document.addEventListener('DOMContentLoaded', (event) => {
    const detailsElements = document.querySelectorAll('details');
    const storageKey = 'collapsibleState_'; // Prefix for local storage keys

    // --- 1. Load the saved state when the page opens ---
    detailsElements.forEach((details, index) => {
        // Use the index or a unique ID to identify this specific panel
        const panelId = storageKey + details.id;
        const savedState = localStorage.getItem(panelId);

        // If 'closed' was saved, remove the 'open' attribute
        if (savedState === 'closed') {
            details.removeAttribute('open');
        }

        // --- 2. Save the state when the panel is toggled ---
        details.addEventListener('toggle', () => {
            if (details.open) {
                // If it's open, save 'open'
                localStorage.setItem(panelId, 'open');
            } else {
                // If it's closed, save 'closed'
                localStorage.setItem(panelId, 'closed');
            }
        });
    });
});
