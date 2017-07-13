"use strict";

const INPUTS = ["port", "username", "password", "host"];

const load = function () {
    browser.storage.local.get(INPUTS).then(function (results) {
        for (const key of Object.keys(results)) {
            document.querySelector("input[name=\"" + key + "\"]").value =
                                                                   results[key];
        }
    });
}; // load()

const save = function () {
    if (0 === this.value.length) {
        browser.storage.local.remove(this.name);
    } else {
        browser.storage.local.set({
            [this.name]: this.value
        });
    }
}; // save()

document.addEventListener("DOMContentLoaded", load);

for (const input of document.getElementsByTagName("input")) {
    input.addEventListener("input", save);
}
