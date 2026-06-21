//this js file checks if form values are valid using 4 regex validation rules before saving them
const Validators = ( function () {

    const descriptionRule = /^\S(?:.*\S)?$/;
    const amountRule = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
    const dateRule = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    const categoryRule = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
    const duplicateWordRule = /\b(\w+)\s+\1\b/i;

    // remove user input by removing any white spaces
    function cleanText(value) {
        return String(value).trim().replace(/\s+/g, " ");
    }

    //validate input & retun error msg if applicable
    function validateRecord(record) {
        const errors = {};

        if (!descriptionRule.test(record.description)) {
            errors.description = "Do not start or end with spaces.";
        }
        if (duplicateWordRule.test(record.description)) {
            errors.description = "Remove repeated words like tea tea.";
        }
        if (!amountRule.test(record.amount)) {
            errors.amount = "use a number like 2500 or 2500.50.";
        }
        if (!categoryRule.test(record.category)) {
            errors.category = "use letters spaces and hyphens only.";
        }
        if (!dateRule.test(record.date)) {
            errors.date = "Use a valid date";
        }
        return errors;
    }

    //now clean values after validation
    function prepareRecord(record) {
        return {
            description: cleanText(record.description),
            amount: record.amount,
            category: cleanText(record.category),
            date: record.date
        };
    }

    return {
        cleanText: cleanText,
        validateRecord: validateRecord,
        prepareRecord: prepareRecord,
        rules: {
            description: descriptionRule,
            amount: amountRule,
            date: dateRule,
            category: categoryRule,
            duplicateWord: duplicateWordRule
        }
    };
})();