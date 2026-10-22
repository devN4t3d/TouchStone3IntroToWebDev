const bakeryProducts = [
    { id: "breads", name: "Breads" },
    { id: "signature-loaf", name: "Signature Loaf" },
    { id: "pastries", name: "Pastries" },
    { id: "cakes", name: "Cakes" }
];
const storageKeys = { favorites: "northStarFavorites", customerName: "northStarCustomerName" };

function loadFavorites() {
    try {
        const saved = JSON.parse(localStorage.getItem(storageKeys.favorites) || "[]");
        return Array.isArray(saved) ? saved.filter(id => bakeryProducts.some(p => p.id === id)) : [];
    } catch (error) { return []; }
}

function showFavorites() {
    const list = document.getElementById("favorites-list");
    if (!list) return;
    const favorites = loadFavorites();
    list.innerHTML = "";
    document.getElementById("favorites-summary").textContent = favorites.length
        ? "You have " + favorites.length + " favorite product(s):"
        : "No favorites selected yet.";
    favorites.forEach(id => {
        const item = bakeryProducts.find(product => product.id === id);
        const li = document.createElement("li");
        li.textContent = item.name;
        list.appendChild(li);
    });
    document.querySelectorAll(".favorite-button").forEach(button => {
        const selected = favorites.includes(button.dataset.product);
        button.textContent = selected ? "Remove from Favorites" : "Add to Favorites";
        button.setAttribute("aria-pressed", String(selected));
    });
}

function toggleFavorite(id) {
    const favorites = loadFavorites();
    const index = favorites.indexOf(id);
    if (index === -1) favorites.push(id);
    else favorites.splice(index, 1);
    localStorage.setItem(storageKeys.favorites, JSON.stringify(favorites));
    showFavorites();
}

function showError(id, message) {
    document.getElementById(id + "-error").textContent = message;
    const field = document.getElementById(id);
    if (message) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
}

function validateForm() {
    let valid = true;
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const details = document.getElementById("item-details").value.trim();
    const checks = {
        name: name.length < 2 ? "Please enter your name (at least 2 characters)." : "",
        email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Please enter a valid email address." : "",
        "pickup-date": !document.getElementById("pickup-date").value ? "Please select a pickup date." : "",
        "request-type": !document.getElementById("request-type").value ? "Please choose a request type." : "",
        "item-details": details.length < 5 ? "Please describe your request (at least 5 characters)." : "",
        "contact-agreement": !document.getElementById("contact-agreement").checked ? "Please confirm you understand this is a request." : ""
    };
    Object.keys(checks).forEach(id => {
        showError(id, checks[id]);
        if (checks[id]) valid = false;
    });
    return valid;
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".favorite-button").forEach(button => {
        button.addEventListener("click", () => toggleFavorite(button.dataset.product));
    });
    showFavorites();

    const form = document.getElementById("contact-form");
    if (form) {
        const nameField = document.getElementById("name");
        nameField.value = localStorage.getItem(storageKeys.customerName) || "";
        nameField.addEventListener("input", () => {
            localStorage.setItem(storageKeys.customerName, nameField.value);
            showError("name", "");
        });
        ["email", "pickup-date", "request-type", "item-details", "contact-agreement"].forEach(id => {
            document.getElementById(id).addEventListener("change", () => showError(id, ""));
        });
        form.addEventListener("submit", event => {
            event.preventDefault();
            const status = document.getElementById("form-status");
            if (validateForm()) {
                status.textContent = "Form checked successfully. This is a demonstration; your request has not been sent.";
            } else {
                status.textContent = "Please correct the highlighted fields and try again.";
            }
        });
        form.addEventListener("reset", () => {
            setTimeout(() => {
                ["name", "email", "pickup-date", "request-type", "item-details", "contact-agreement"].forEach(id => showError(id, ""));
                document.getElementById("form-status").textContent = "";
                localStorage.removeItem(storageKeys.customerName);
            }, 0);
        });
    }
});
