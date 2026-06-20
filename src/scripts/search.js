// this file helps with regex search and highlighting
const Search = (function () {

    function compileRegex(pattern, caseSensitive) {
        if (pattern.trim() === "") {
            return {
                regex: null,
                error: ""
            };
        }

        try {
            return {
                regex: new RegExp(pattern, caseSensitive ? "g" : "gi"),
                error: ""
            };
        } catch (error) {
            return {
                regex: null,
                error: error.message
            };
        }
    }

    // protects the table from showing unwanted html from user input
    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function highlightText(text, regex) {
        const safeText = escapeHtml(text);

        if (!regex) {
            return safeText;
        }

        regex.lastIndex = 0;

        return safeText.replace(regex, function (match) {
            return "<mark>" + match + "</mark>";
        });
    }

    return {
        compileRegex: compileRegex,
        escapeHtml: escapeHtml,
        highlightText: highlightText
    };
})();
