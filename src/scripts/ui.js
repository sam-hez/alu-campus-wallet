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

//Transaction form input fields
const descriptionInput = document.querySelector("#record-description");
const amountInput = document.querySelector("#record-amount");
const categoryInput = document.querySelector("#record-category");
const dateInput = document.querySelector("#record-date");

// records table elements
const recordsTableBody = document.querySelector("#recordsTableBody");
const recordsStatus = document.querySelector("#records-status");

// search and sort controls
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const caseToggle = document.querySelector("#case-toggle");

// dashboard and settings elements
const totalSpent = document.querySelector("#totalspent");
const remainingBudget = document.querySelector("#remainingbudget");
const highestExpense = document.querySelector("#highestexpense");
const spendingChart = document.querySelector("#spending-chart");
const categoryChart = document.querySelector("#category-chart");
const budgetStatus = document.querySelector("#budget-status");
const budgetBar = document.querySelector("#budget-bar");
const recentRecordsBox = document.querySelector(".recentRecords");
const budgetCapInput = document.querySelector("#budget-cap");
const baseCurrencySelect = document.querySelector("#base-currency");
const ugxRateInput = document.querySelector("#ugxrate");
const usdRateInput = document.querySelector("#usdrate");
const saveSettingsButton = document.querySelector("#save-settings-btn");
const settingsStatus = document.querySelector("#settings-status");
const exportButton = document.querySelector("#export-btn");
const importInput = document.querySelector("#import-input");
const importStatus = document.querySelector("#import-status");

//Transaction form error messages
const descriptionError = document.querySelector("#description-error");
const amountError = document.querySelector("#amount-error");
const categoryError = document.querySelector("#category-error");
const dateError = document.querySelector("#date-error");
// remember the button/link the user clicked before the popup opened **
let lastFocusedElement = null;

// app records loaded from browser storage
let records = [];

// store id of records being edited
let editingRecordId = "";

// app settings loaded from browser storage
let settings = State.getDefaultSettings();

function saveAppData() {
    Storage.saveData(State.makeAppData(records, settings));
}

function loadAppData() {
    const savedData = Storage.loadData();

    if (!savedData) {
        return;
    }

    const preparedData = State.prepareImportedData(savedData);

    if (!preparedData.error) {
        records = preparedData.data.records;
        settings = preparedData.data.settings;
    }
}

function getSettingsFromForm() {
    return State.prepareSettings({
        budgetCap: budgetCapInput.value,
        currency: baseCurrencySelect.value,
        ugxRate: ugxRateInput.value,
        usdRate: usdRateInput.value
    });
}

function updateSettingsFields() {
    budgetCapInput.value = settings.budgetCap;
    baseCurrencySelect.value = settings.currency;
    ugxRateInput.value = settings.ugxRate;
    usdRateInput.value = settings.usdRate;
}



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
function openRecordPopup(record) {
    if (!recordPopup) {
        return;
    }
    lastFocusedElement = document.activeElement;

    recordPopup.classList.add("show");
    recordPopup.setAttribute("aria-hidden", "false");

    const popupTitle = document.querySelector("#record-popup-title");

    clearFormErrors();

    if (record) {
        editingRecordId = record.id;

        if (popupTitle) {
            popupTitle.textContent = "Edit Transaction";
        }

        descriptionInput.value = record.description;
        amountInput.value = record.amount;
        categoryInput.value = record.category;
        dateInput.value = record.date;
    } else {
        editingRecordId = "";

        if (popupTitle) {
            popupTitle.textContent = "Add Transaction";
        }

        recordForm.reset();
        dateInput.value = new Date().toISOString().slice(0, 10);
    }

    amountInput.focus();
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

// show money using the selected settings currency
function formatMoney(amount) {
    return State.formatMoney(amount, settings);
}

// clear the form after saving or editing
function clearRecordForm() {
    recordForm.reset();
    editingRecordId = "";

    if (formStatus) {
        formStatus.textContent = "";
    }
}

//filter transactions using the regex search box
function getVisibleRecords() {
    const searchText = searchInput.value;
    const caseSensitive = caseToggle.checked;
    const searchResult = Search.compileRegex(searchText, caseSensitive);

    if (searchResult.error) {
        if (recordsStatus) {
            recordsStatus.textContent = "Invalid regex: " + searchResult.error;
        }
        return State.sortRecords(records, sortSelect.value);
    }
    if (!searchResult.regex) {
        return State.sortRecords(records, sortSelect.value);
    }

    const filtered = [];
    for (let i = 0; i < records.length; i++) {
        const textToSearch = records[i].description + " " +
            records[i].amount + " " +
            records[i].category + " " +
            records[i].date;

        searchResult.regex.lastIndex = 0;

        if (searchResult.regex.test(textToSearch)) {
            filtered.push(records[i]);
        }
    }
    return State.sortRecords(filtered, sortSelect.value);
}

// draw a simple svg line chart
function renderLineChart() {
    const days = State.getLastSevenDays(records);
    let max = 0;

    for (let i = 0; i < days.length; i++) {
        if (days[i].total > max) {
            max = days[i].total;
        }
    }

    if (max === 0) {
        spendingChart.innerHTML = "No spending data yet.";
        return;
    }

    const width = 320;
    const height = 150;
    const gap = width / 6;
    let points = "";

    for (let i = 0; i < days.length; i++) {
        const x = Math.round(i * gap);
        const y = Math.round(height - ((days[i].total / max) * 120) - 15);
        points = points + x + "," + y + " ";
    }

    spendingChart.innerHTML =
        "<svg class='line-chart' viewBox='0 0 320 170' role='img' aria-label='Last 7 days spending line chart'>" +
            "<polyline points='" + points + "' fill='none' stroke='#0d2f69' stroke-width='3'></polyline>" +
            "<line x1='0' y1='150' x2='320' y2='150' stroke='#d1d5db'></line>" +
        "</svg>";
}

// draw a simple donut chart using category totals
function renderDonutChart() {
    const totals = State.getCategoryTotals(records);
    const colors = ["#0d2f69", "#2589EE", "#b9c0f1", "#f2c94c", "#27ae60", "#b42318"];
    let sum = 0;
    let colorIndex = 0;
    let current = 0;
    let gradient = "";

    for (const category in totals) {
        sum = sum + totals[category];
    }

    if (sum === 0) {
        categoryChart.innerHTML = "No category data yet.";
        return;
    }

    for (const category in totals) {
        const start = current;
        const end = current + ((totals[category] / sum) * 100);
        gradient = gradient + colors[colorIndex % colors.length] + " " + start + "% " + end + "%, ";
        current = end;
        colorIndex++;
    }

    gradient = gradient.slice(0, -2);

    categoryChart.innerHTML =
        "<div class='donut-chart' style='background: conic-gradient(" + gradient + ");'>" +
            "<div class='donut-hole'></div>" +
        "</div>" +
        "<p>Top category: " + Search.escapeHtml(State.getTopCategory(records)) + "</p>";
}

// show the latest three transactions on dashboard
function renderRecentRecords() {
    const recent = State.getRecentRecords(records, 3);

    if (recent.length === 0) {
        recentRecordsBox.innerHTML = "<h2>Recent Transactions</h2>" +
            "<p><span id='totalrecords'>" + records.length + "</span> total transactions recorded.</p>" +
            "<p>Recent transactions will appear here later.</p>";
        return;
    }

    let list = "<h2>Recent Transactions</h2>" +
        "<p><span id='totalrecords'>" + records.length + "</span> total transactions recorded.</p>" +
        "<ul>";

    for (let i = 0; i < recent.length; i++) {
        list = list + "<li>" +
            Search.escapeHtml(recent[i].description) + " - " +
            formatMoney(recent[i].amount) + " (" +
            Search.escapeHtml(recent[i].date) + ")" +
        "</li>";
    }

    list = list + "</ul>";
    recentRecordsBox.innerHTML = list;
}

// show budget bar and live budget message
function renderBudgetProgress(total) {
    const left = settings.budgetCap - total;
    let percent = 0;

    if (settings.budgetCap > 0) {
        percent = Math.round((total / settings.budgetCap) * 100);
    }

    if (percent > 100) {
        percent = 100;
    }

    budgetBar.style.width = percent + "%";

    if (left >= 0) {
        budgetBar.style.background = "#0d2f69";
        budgetStatus.setAttribute("aria-live", "polite");
        budgetStatus.textContent = formatMoney(left) + " remaining from your budget.";
    } else {
        budgetBar.style.background = "#b42318";
        budgetStatus.setAttribute("aria-live", "assertive");
        budgetStatus.textContent = "You are over budget by " + formatMoney(Math.abs(left)) + ".";
    }
}

// update all dashboard areas
function renderDashboard() {
    const total = State.getTotalSpent(records);
    const left = settings.budgetCap - total;

    totalSpent.textContent = formatMoney(total);
    remainingBudget.textContent = formatMoney(Math.abs(left));

    if (left >= 0) {
        remainingBudget.parentElement.querySelector("h3").textContent = "Budget Left";
    } else {
        remainingBudget.parentElement.querySelector("h3").textContent = "Over Budget";
    }

    highestExpense.textContent = State.getTopCategory(records);
    renderLineChart();
    renderDonutChart();
    renderRecentRecords();
    renderBudgetProgress(total);
}

// show all transactions in the table
function renderRecords() {
    if (records.length === 0) {
        recordsTableBody.innerHTML = "<tr><td colspan='5'>No records yet. Add your first transaction.</td></tr>";

        if (recordsStatus) {
            recordsStatus.textContent = "No transactions to show.";
        }

        return;
    }

    const visibleRecords = getVisibleRecords();
    const searchResult = Search.compileRegex(searchInput.value, caseToggle.checked);
    const activeRegex = searchResult.error ? null : searchResult.regex;

    if (visibleRecords.length === 0) {
        recordsTableBody.innerHTML = "<tr><td colspan='5'>No matching transactions.</td></tr>";

        if (recordsStatus) {
            recordsStatus.textContent = "0 matching transactions.";
        }

        return;
    }

    let rows = "";

    for (let i = 0; i < visibleRecords.length; i++) {
        rows = rows + "<tr>" +
            "<td data-label='Description'>" + Search.highlightText(visibleRecords[i].description, activeRegex) + "</td>" +
            "<td data-label='Amount'>" + Search.highlightText(formatMoney(visibleRecords[i].amount), activeRegex) + "</td>" +
            "<td data-label='Expense Category'>" + Search.highlightText(visibleRecords[i].category, activeRegex) + "</td>" +
            "<td data-label='Date'>" + Search.highlightText(visibleRecords[i].date, activeRegex) + "</td>" +
            "<td data-label='Perform Action'>" +
                "<button type='button' data-edit='" + visibleRecords[i].id + "'>Edit</button> " +
                "<button type='button' data-delete='" + visibleRecords[i].id + "'>Delete</button>" +
            "</td>" +
        "</tr>";
    }

    recordsTableBody.innerHTML = rows;

    if (recordsStatus) {
        if (searchResult.error) {
            recordsStatus.textContent = "Invalid regex: " + searchResult.error;
        } else {
            recordsStatus.textContent = visibleRecords.length + " transaction(s) shown.";
        }
    }
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

// ** validate and save the transaction temporarily ** //
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

        if (editingRecordId) {
            State.updateRecord(records, editingRecordId, cleanRecord);
        } else {
            State.addRecord(records, cleanRecord);
        }

        saveAppData();
        renderRecords();
        renderDashboard();
        clearRecordForm();
        closeRecordPopup();
        showPage("records");
    });
}

// handle edit and delete buttons in the table
if (recordsTableBody) {
    recordsTableBody.addEventListener("click", function (event) {
        const editId = event.target.getAttribute("data-edit");
        const deleteId = event.target.getAttribute("data-delete");

        if (editId) {
            const record = State.findRecordById(records, editId);

            if (record) {
                openRecordPopup(record);
            }
        }

        if (deleteId) {
            const shouldDelete = confirm("Delete this transaction?");

            if (shouldDelete) {
                records = State.deleteRecord(records, deleteId);

                saveAppData();
                renderRecords();
                renderDashboard();
            }
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

//Update table when user searches or changes sorting
searchInput.addEventListener("input", function () {renderRecords();});
caseToggle.addEventListener("change", function () {renderRecords();});
sortSelect.addEventListener("change", function () {renderRecords();});

// save settings and update money display
if (saveSettingsButton) {
    saveSettingsButton.addEventListener("click", function () {
        const newSettings = getSettingsFromForm();
        const settingsError = State.validateSettings(newSettings);

        if (settingsError) {
            settingsStatus.textContent = settingsError;
            return;
        }

        settings = newSettings;
        saveAppData();
        settingsStatus.textContent = "Settings saved.";
        renderRecords();
        renderDashboard();
    });
}

// export all current app data
if (exportButton) {
    exportButton.addEventListener("click", function () {
        Storage.exportData(State.makeAppData(records, settings));

        if (importStatus) {
            importStatus.textContent = "Exported your JSON file.";
        }
    });
}

// import records and settings from a json file
if (importInput) {
    importInput.addEventListener("change", function () {
        const file = importInput.files[0];

        if (!file) {
            return;
        }

        Storage.readImportFile(file, function (error, data) {
            if (error) {
                importStatus.textContent = error;
                return;
            }

            const preparedData = State.prepareImportedData(data);

            if (preparedData.error) {
                importStatus.textContent = preparedData.error;
                return;
            }

            records = preparedData.data.records;
            settings = preparedData.data.settings;
            saveAppData();
            updateSettingsFields();
            renderRecords();
            renderDashboard();
            importStatus.textContent = "Imported " + records.length + " transaction(s).";
            importInput.value = "";
        });
    });
}

loadAppData();
updateSettingsFields();

// show  empty table message when the page first opens
renderRecords();
renderDashboard();
