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

// transaction form input fields
const descriptionInput = document.querySelector("#record-description");
const amountInput = document.querySelector("#record-amount");
const categoryInput = document.querySelector("#record-category");
const dateInput = document.querySelector("#record-date");

// transaction form error messages
const descriptionError = document.querySelector("#description-error");
const amountError = document.querySelector("#amount-error");
const categoryError = document.querySelector("#category-error");
const dateError = document.querySelector("#date-error");
// remember the button/link the user clicked before the popup opened **
let lastFocusedElement = null;



/*NAVBAR LOGIC*/
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

// connect the add button on nav to the popup
if (addButton) {
    addButton.addEventListener("click", function (event) {
        event.preventDefault();

        closeMobileNav();
        openRecordPopup();
    });
}



/*POPUP BOX LOGIC*/
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

/*  close the transaction popup*/
function closeRecordPopup() {
    if (!recordPopup) {
        return;
    }

    recordPopup.classList.remove("show");
    recordPopup.setAttribute("aria-hidden", "true");

    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}

// get the current values from the form
function getRecordFromForm() {
    return {
        description: descriptionInput.value,
        amount: amountInput.value,
        category: categoryInput.value,
        date: dateInput.value
    };
}

//  clear old form errors before checking again
function clearFormErrors() {
    descriptionError.textContent = "";
    amountError.textContent = "";
    categoryError.textContent = "";
    dateError.textContent = "";

    if (formStatus) {
        formStatus.textContent = "";
    }
}

// put validation errors under the correct fields
function showFormErrors(errors) {
    descriptionError.textContent = errors.description || "";
    amountError.textContent = errors.amount || "";
    categoryError.textContent = errors.category || "";
    dateError.textContent = errors.date || "";
}

// check if the errors object has any error inside it
function hasErrors(errors) {
    return Object.keys(errors).length > 0;
}

// Close popup when clicking the X button
if (closePopupButton) {
    closePopupButton.addEventListener("click", function () {
        closeRecordPopup();
    });
}

// close popup when clicking Cancel
if (cancelPopupButton) {
    cancelPopupButton.addEventListener("click", function () {
        closeRecordPopup();
    });
}

// Close popup when clicking the dark background outside the form box
if (recordPopup) {
    recordPopup.addEventListener("click", function (event) {
        if (event.target === recordPopup) {
            closeRecordPopup();
        }
    });
}

// Close popup when pressing Escape
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && recordPopup && recordPopup.classList.contains("show")) {
        closeRecordPopup();
    }
});

// ** validate and save the transaction here ** //
if (recordForm) {
    recordForm.addEventListener("submit", function (event) {
        event.preventDefault();

        clearFormErrors();

        const rawRecord = getRecordFromForm();
        const errors = Validators.validateRecord(rawRecord);

        if (hasErrors(errors)) {
            showFormErrors(errors);

            if (formStatus) {
                formStatus.textContent = "Please fix the form errors before saving.";
            }

            return;
        }

        const cleanRecord = Validators.prepareRecord(rawRecord);

        if (formStatus) {
            formStatus.textContent = "Valid transaction: " + cleanRecord.description + " - " + cleanRecord.amount + " RWF.";
        }
    });
}


// checks the form while the user types
function  validateWhileTyping() {
    clearFormErrors();
    const rawRecord = getRecordFromForm();
    const errors = Validators.validateRecord(rawRecord);
    showFormErrors(errors);
}

descriptionInput.addEventListener("input", validateWhileTyping);
amountInput.addEventListener("input", validateWhileTyping);
categoryInput.addEventListener("input", validateWhileTyping);
dateInput.addEventListener("input", validateWhileTyping);



