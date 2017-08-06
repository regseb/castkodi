"use strict";

define(["../jsonrpc"], function (jsonrpc) {

    /**
     * La liste des paramètres de l'extension.
     */
    const INPUTS = ["port", "username", "password", "host"];

    /**
     * Active / Désactive le bouton pour tester les paramètres.
     */
    const activate = function () {
        document.getElementById("result").innerHTML = "";
        browser.storage.local.get(["host", "port"]).then(function (config) {
            document.getElementById("test").disabled =
                                               2 !== Object.keys(config).length;
        });
    }; // activate()

    /**
     * Enregistre une paramètre.
     *
     * @this HTMLInputElement
     */
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

    /**
     * Teste la connexion à Kodi.
     *
     * @param {Event} event L'évènement du clic.
     */
    const test = function (event) {
        event.preventDefault();
        const result = document.getElementById("result");
        result.innerHTML = browser.i18n.getMessage("options_result_pending");
        jsonrpc("JSONRPC.Version").then(function () {
            result.innerHTML = browser.i18n.getMessage("options_result_succes");
        }, function () {
            result.innerHTML = browser.i18n.getMessage("options_result_fail");
        });
    }; // test()

    // Afficher les textes dans la langue courante.
    for (const element of document.querySelectorAll("[data-i18n-content]")) {
        const key = "options_" + element.getAttribute("data-i18n-content") +
                    "_content";
        element.innerHTML = browser.i18n.getMessage(key);
    }

    // Pré-remplir les champs du formulaire.
    browser.storage.local.get(INPUTS).then(function (results) {
        for (const key of Object.keys(results)) {
            document.querySelector("input[name=\"" + key + "\"]").value =
                                                                   results[key];
        }
        activate();
    });

    // Écouter les actions dans le formulaire (champs et bouton).
    for (const input of document.getElementsByTagName("input")) {
        input.addEventListener("input", save);
    }
    document.getElementById("test").addEventListener("click", test);
});
