// Main navigation elements
const navToggle = document.querySelector("#nav-toggle");
const siteNav = document.querySelector("#nav");
const navLinks = document.querySelectorAll(".nav-link");
const pages = document.querySelectorAll(".page");


// Transaction popup elements
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

// change pages function
navToggle.addEventListener("click", function() {

});



// open popup form 



