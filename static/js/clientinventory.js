const INVENTORY_KEY = "inventory";

document.addEventListener("DOMContentLoaded", () => {
    const inventory = loadInventory();
    inventory.forEach(markAsMined);

    // Listen for mining events
    document.addEventListener("inventory:add", e => {
        markAsMined(e.detail.word);
    });
});

function loadInventory() {
    try {
        return JSON.parse(localStorage.getItem(INVENTORY_KEY)) || [];
    } catch {
        return [];
    }
}

function saveInventory(inv) {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inv));
}

function addToInventory(word) {
    const inventory = loadInventory();
    if (!inventory.includes(word)) {
        inventory.push(word);
        saveInventory(inventory);
    }
}

// Visually mark a word as mined
function markAsMined(word) {
    const el = document.querySelector(`[data-mineable="${word}"]`);
    if (!el) return;

    el.classList.add("mined");
    el.classList.remove("cracking");
    el.style.setProperty("--progress", 0);
}
