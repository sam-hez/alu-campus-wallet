// this file keeps small data helper functions away from ui.js
const State = (function () {
    const defaultSettings = {
        budgetCap: 118000,
        currency: "RWF",
        ugxRate: 2490,
        usdRate: 1464
    };

    function getDefaultSettings() {
        return {
            budgetCap: defaultSettings.budgetCap,
            currency: defaultSettings.currency,
            ugxRate: defaultSettings.ugxRate,
            usdRate: defaultSettings.usdRate
        };
    }

    function makeRecordId() {
        return "txn_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    }

    function findRecordById(records, id) {
        let foundRecord = null;

        for (let i = 0; i < records.length; i++) {
            if (records[i].id === id) {
                foundRecord = records[i];
            }
        }

        return foundRecord;
    }

    function addRecord(records, cleanRecord) {
        const now = new Date().toISOString();

        cleanRecord.id = makeRecordId();
        cleanRecord.amount = Number(cleanRecord.amount);
        cleanRecord.createdAt = now;
        cleanRecord.updatedAt = now;
        records.push(cleanRecord);
    }

    function updateRecord(records, id, cleanRecord) {
        const oldRecord = findRecordById(records, id);

        if (oldRecord) {
            oldRecord.description = cleanRecord.description;
            oldRecord.amount = Number(cleanRecord.amount);
            oldRecord.category = cleanRecord.category;
            oldRecord.date = cleanRecord.date;
            oldRecord.updatedAt = new Date().toISOString();
        }
    }

    function deleteRecord(records, id) {
        return records.filter(function (record) {
            return record.id !== id;
        });
    }

    function sortRecords(list, sortMode) {
        const sortedList = list.slice();

        sortedList.sort(function (a, b) {
            if (sortMode === "newest") {return b.date.localeCompare(a.date);}
            if (sortMode === "oldest") {return a.date.localeCompare(b.date);}
            if (sortMode === "az") {return a.description.localeCompare(b.description);}
            if (sortMode === "za") {return b.description.localeCompare(a.description);}
            if (sortMode === "low-high") {return a.amount - b.amount;}
            if (sortMode === "high-low") {return b.amount - a.amount;}
            return 0;
        });
        return sortedList;
    }

    function getRecentRecords(records, count) {
        const sortedRecords = sortRecords(records, "newest");
        return sortedRecords.slice(0, count);
    }

    function formatMoney(amount, settings) {
        let displayAmount = Number(amount);
        let digits = 0;

        if (settings.currency === "USD") {
            displayAmount = displayAmount / settings.usdRate;
            digits = 2;
        }
        if (settings.currency === "UGX") {
            displayAmount = displayAmount * settings.ugxRate;
        }

        return displayAmount.toLocaleString(undefined, {
            maximumFractionDigits: digits
        }) + " " + settings.currency;
    }

    function getTotalSpent(records) {
        let total = 0;
        for (let i = 0; i < records.length; i++) {
            total = total + Number(records[i].amount);
        }

        return total;
    }


    function getCategoryTotals(records) {
        const totals = {};

        for (let i = 0; i < records.length; i++) {
            const category = records[i].category;

            if (!totals[category]) {
                totals[category] = 0;
            }

            totals[category] = totals[category] + Number(records[i].amount);
        }
        return totals;
    }

    function getTopCategory(records) {
        const totals = getCategoryTotals(records);
        let topName = "None";
        let topAmount = 0;

        for (const category in totals) {
            if (totals[category] > topAmount) {
                topName = category;
                topAmount = totals[category];
            }
        }

        return topName;
    }

    function formatDate(date) {
        return date.toISOString().slice(0, 10);
    }

    function getLastSevenDays(records) {
        const days = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            days.push({
                date: formatDate(date),
                total: 0
            });
        }
        for (let i = 0; i < records.length; i++) {
            for (let j = 0; j < days.length; j++) {
                if (records[i].date === days[j].date) {
                    days[j].total = days[j].total + Number(records[i].amount);
                }
            }
        }
        return days;
    }

    function prepareSettings(rawSettings) {
        const settings = getDefaultSettings();

        if (rawSettings) {
            settings.budgetCap = Number(rawSettings.budgetCap);
            settings.currency = rawSettings.currency;
            settings.ugxRate = Number(rawSettings.ugxRate);
            settings.usdRate = Number(rawSettings.usdRate);
        }

        return settings;
    }

    function validateSettings(settings) {
        if (!settings.budgetCap || settings.budgetCap <= 0) {
            return "Enter a valid budget limit.";
        }

        if (settings.currency !== "RWF" && settings.currency !== "UGX" && settings.currency !== "USD") {
            return "Choose a valid currency.";
        }

        if (!settings.ugxRate || settings.ugxRate <= 0) {
            return "Enter a valid ugx rate.";
        }

        if (!settings.usdRate || settings.usdRate <= 0) {
            return "Enter a valid usd rate.";
        }

        return "";
    }

    function makeAppData(records, settings) {
        return {
            settings: settings,
            records: records
        };
    }

    function prepareImportedData(data) {
        if (!data || !Array.isArray(data.records) || !data.settings) {
            return {
                error: "JSON must include records and settings.",
                data: null
            };
        }

        const cleanSettings = prepareSettings(data.settings);
        const settingsError = validateSettings(cleanSettings);

        if (settingsError) {
            return {
                error: settingsError,
                data: null
            };
        }

        const cleanRecords = [];

        for (let i = 0; i < data.records.length; i++) {
            const rawRecord = {
                description: data.records[i].description,
                amount: String(data.records[i].amount),
                category: data.records[i].category,
                date: data.records[i].date
            };
            const errors = Validators.validateRecord(rawRecord);

            if (Object.keys(errors).length > 0) {
                return {
                    error: "Record " + (i + 1) + " is invalid.",
                    data: null
                };
            }

            const cleanRecord = Validators.prepareRecord(rawRecord);
            cleanRecord.id = data.records[i].id || makeRecordId();
            cleanRecord.amount = Number(cleanRecord.amount);
            cleanRecord.createdAt = data.records[i].createdAt || new Date().toISOString();
            cleanRecord.updatedAt = data.records[i].updatedAt || new Date().toISOString();
            cleanRecords.push(cleanRecord);
        }

        return {
            error: "",
            data: makeAppData(cleanRecords, cleanSettings)
        };
    }

    return {
        getDefaultSettings: getDefaultSettings,

        makeRecordId: makeRecordId,
        findRecordById: findRecordById,
        addRecord: addRecord,
        updateRecord: updateRecord,
        deleteRecord: deleteRecord,
        sortRecords: sortRecords,
        getRecentRecords: getRecentRecords,

        formatMoney: formatMoney,
        getTotalSpent: getTotalSpent,
        getCategoryTotals: getCategoryTotals,
        getTopCategory: getTopCategory,

        getLastSevenDays: getLastSevenDays,
        prepareSettings: prepareSettings,
        validateSettings: validateSettings,
        makeAppData: makeAppData,
        prepareImportedData: prepareImportedData
    };
})();
