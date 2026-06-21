// this file saves and loads app data from the USERS browser
const Storage = (function () {
    const storageKey = "aluCampusWalletData";

    function saveData(data) {
        localStorage.setItem(storageKey, JSON.stringify(data));
    }

    function loadData() {
        const savedText = localStorage.getItem(storageKey);

        if (!savedText) {
            return null;
        }

        try {return JSON.parse(savedText);
        } catch (error) {
            return null;
        }
    }

    function exportData(data) {
        const jsonText = JSON.stringify(data, null, 2);
        const fileBlob = new Blob([jsonText], {type: "application/json"});
        const fileUrl = URL.createObjectURL(fileBlob);
        const downloadLink = document.createElement("a");

        downloadLink.href = fileUrl;
        downloadLink.download = "alu-campus-wallet-data.json";
        downloadLink.click();

        URL.revokeObjectURL(fileUrl);
    }

    function readImportFile(file, callback) {
        const reader = new FileReader();

        reader.onload = function () {
            try {
                callback("", JSON.parse(reader.result));
            } catch (error) {
                callback("The selected file is not valid JSON.", null);
            }
        };

        reader.onerror = function () {
            callback("Could not read the selected file.", null);
        };

        reader.readAsText(file);
    }

    return {
        saveData: saveData,
        loadData: loadData,
        exportData: exportData,
        readImportFile: readImportFile
    };
})();
