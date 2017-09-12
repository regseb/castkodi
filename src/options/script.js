"use strict";

require.config({
    "baseUrl": "../core"
});

define(["jsonrpc", "pebkac", "notify"],
       function (jsonrpc, PebkacError, notify) {

    /**
     * Active / Désactive le bouton pour tester les paramètres.
     */
    const activate = function () {
        document.getElementById("connection-check").disabled =
                  !(document.getElementById("connection-port").validity.valid &&
                     document.getElementById("connection-host").validity.valid);
    }; // activate()

    const ask = function (input, checked) {
        const permissions = { "permissions": ["history"] };
        if (checked) {
            browser.permissions.request(permissions).then(function (response) {
                input.checked = response;
                browser.storage.local.set({ "general-history": response });
            });
        } else {
            browser.permissions.remove(permissions);
            browser.storage.local.set({ "general-history": false });
        }
    }; // ask()

    /**
     * Enregistre une paramètre.
     *
     * @this HTMLInputElement
     */
    const save = function () {
        const key = this.form.id + "-" + this.name;
        if ("checkbox" === this.type) {
            ask(this, this.checked);
        } else if ("radio" === this.type) {
            browser.storage.local.set({ [key]: this.value });
        } else if (0 === this.value.length) {
            browser.storage.local.remove(key);
        } else {
            browser.storage.local.set({ [key]: this.value });
        }

        activate();
    }; // save()

    /**
     * Teste la connexion à Kodi.
     *
     * @param {Event} event L'évènement du clic.
     */
    const check = function (event) {
        event.preventDefault();
        jsonrpc.check().then(function () {
            notify(new PebkacError("success"));
        }).catch(notify);
    }; // check()

    // Afficher les textes dans la langue courante.
    for (const element of document.querySelectorAll("[data-i18n-content]")) {
        const key = "options_" + element.getAttribute("data-i18n-content") +
                    "_content";
        element.textContent = browser.i18n.getMessage(key);
    }

    // Pré-remplir les champs du formulaire.
    browser.storage.local.get().then(function (results) {
        for (const key of Object.keys(results)) {
            const [form, name] = key.split("-");
            const inputs = document.querySelectorAll(
                                   "#" + form + " input[name=\"" + name + "\"");
            if (1 === inputs.length) {
                const input = inputs[0];
                if ("checkbox" === input.type) {
                    input.checked = results[key];
                } else {
                    input.value = results[key];
                }
            } else { // Sinon c'est un radio bouton.
                for (const input of inputs) {
                    input.checked = results[key] === input.value;
                }
            }
        }
        activate();
    });

    // Écouter les actions dans le formulaire (champs et bouton).
    for (const input of document.getElementsByTagName("input")) {
        input.addEventListener("input", save);
    }
    document.getElementById("connection-check").addEventListener("click",
                                                                 check);
});
