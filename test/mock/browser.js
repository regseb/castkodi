"use strict";

const browser = {
    "i18n": {
        "getMessage": function (key, subsitutions) {
            return key + ": " +
                   (Array.isArray(subsitutions) ? subsitutions.join(",")
                                                : subsitutions);
        } // getMessage()
    }
};

module.exports = browser;
