// select main navigation elements
const navToggle = document.querySelector("#nav-toggle");
const siteNav = document.querySelector("#nav");
const navLinks = document.querySelectorAll(".nav-link");
const pages = document.querySelectorAll(".page");

// select transaction popup elements
const addButton = document.querySelector(".new-transaction-btn");
const recordPopup = document.querySelector("#record-popup");
const closePopupButton = document.querySelector("#close-record-popup");
const cancelPopupButton = document.querySelector("#cancel-record-popup");
const recordForm = document.querySelector("#record-form");
const formStatus = document.querySelector("#form-status");
// remember the button/link the user clicked before the popup opened **
let lastFocusedElement = null;



// function to closes the mobile navigation menu
function closeMobileNav() {
    if (siteNav) {
        siteNav.classList.remove("open");
    }
    if (navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
    }
}

// open or closes the mobile menu
if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
        const isOpen = siteNav.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });
}

// shows one page and hides the others pages
function showPage(pageId) {
    let i;
    for (i = 0; i < pages.length; i++) {
        if (pages[i].id === pageId) {
            pages[i].classList.add("active");
        } else {
            pages[i].classList.remove("active");
        }
    }
    for (i = 0; i < navLinks.length; i++) {
        if (navLinks[i].getAttribute("data-page") === pageId) {
            navLinks[i].classList.add("active");
        } else {
            navLinks[i].classList.remove("active");
        }
    }
    closeMobileNav();
}

// connects each nav link to the correct page
for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", function (event) {
        event.preventDefault();
        const pageId = this.getAttribute("data-page");
        showPage(pageId);
    });
}


// function to open the transaction popup box
function openRecordPopup() {
    if (!recordPopup) {
        return;
    }
    lastFocusedElement = document.activeElement;

    recordPopup.classList.add("show");
    recordPopup.setAttribute("aria-hidden", "false");

    const popupTitle = document.querySelector("#record-popup-title");
    const dateInput = document.querySelector("#record-date");
    const descriptionInput = document.querySelector("#record-description");
    if (popupTitle) {
        popupTitle.textContent = "Add Transaction";
    }
    if (dateInput) {
        dateInput.value = new Date().toISOString().slice(0, 10);
    }
    if (descriptionInput) {
        descriptionInput.focus();
    }
}

// connect the + Add button on nav to the popup
if (addButton) {
    addButton.addEventListener("click", function (event) {
        event.preventDefault();

        closeMobileNav();
        openRecordPopup();
    });
}

