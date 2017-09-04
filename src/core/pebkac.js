"use strict";

define([], function () {

    const PebkacError = class extends Error {

        constructor(key, subsitutions = []) {
            super(browser.i18n.getMessage("notifications_" + key + "_message",
                                          subsitutions));
            this.name = "PebkacError";
            this.title = browser.i18n.getMessage("notifications_" + key +
                                                 "_title");
        } // constructor()
    }; // PebkacError

    return PebkacError;
});
