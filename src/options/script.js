"use strict";

define(["../jsonrpc"], function (jsonrpc) {

    const INPUTS = ["port", "username", "password", "host"];

    const activate = function () {
        document.getElementById("result").innerHTML = "";
        browser.storage.local.get(["host", "port"]).then(function (config) {
            document.getElementById("test").disabled =
                                               2 !== Object.keys(config).length;
        });
    }; // activate()

    const load = function () {
        browser.storage.local.get(INPUTS).then(function (results) {
            for (const key of Object.keys(results)) {
                document.querySelector("input[name=\"" + key + "\"]").value =
                                                                   results[key];
            }
            activate();
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
        activate();
    }; // save()

    const test = function (event) {
        event.stopPropagation();
        event.preventDefault();
        const result = document.getElementById("result");
        result.innerHTML = browser.i18n.getMessage("options_result_pending");
        jsonrpc("JSONRPC.Version").then(function () {
            result.innerHTML = browser.i18n.getMessage("options_result_succes");
        }, function () {
            result.innerHTML = browser.i18n.getMessage("options_result_fail");
        });
    }; // test()

    for (const element of document.querySelectorAll("[data-i18n-content]")) {
        const key = "options_" + element.getAttribute("data-i18n-content") +
                    "_content";
        element.innerHTML = browser.i18n.getMessage(key);
    }

    document.addEventListener("DOMContentLoaded", load);

    for (const input of document.getElementsByTagName("input")) {
        input.addEventListener("input", save);
    }
    document.getElementById("test").addEventListener("click", test);
});
