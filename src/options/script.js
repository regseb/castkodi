/**
 * @module options/script
 */

import * as jsonrpc    from "../core/jsonrpc.js";
import { notify }      from "../core/notify.js";
import { PebkacError } from "../core/pebkac.js";

/**
 * Active / Désactive le bouton pour tester les paramètres de connexion.
 *
 * @function active
 */
const activate = function () {
    document.getElementById("connection-check").disabled =
                  !(document.getElementById("connection-port").validity.valid &&
                     document.getElementById("connection-host").validity.valid);
};

/**
 * Demande (ou enlève) une permission optionnelle.
 *
 * @function ask
 * @param {Object} input La case à cocher.
 */
const ask = function (input) {
    const permissions = { "permissions": [input.dataset.permissions] };
    if (input.checked) {
        browser.permissions.request(permissions).then((response) => {
            input.checked = response;
            browser.storage.local.set({ [input.id]: response });
        });
    } else {
        browser.permissions.remove(permissions);
        browser.storage.local.set({ [input.id]: false });
    }
};

/**
 * Enregistre un paramètre.
 *
 * @function save
 * @this HTMLInputElement
 */
const save = function () {
    const key = this.form.id + "-" + this.name;
    if ("checkbox" === this.type) {
        if ("permissions" in this.dataset) {
            ask(this);
        } else {
            browser.storage.local.set({ [key]: this.checked });
        }
    } else if ("radio" === this.type) {
        browser.storage.local.set({ [key]: this.value });
    } else if (0 === this.value.length) {
        browser.storage.local.remove(key);
    } else {
        browser.storage.local.set({ [key]: this.value });
    }

    activate();
};

/**
 * Teste la connexion à Kodi.
 *
 * @function check
 * @param {Event} event L'évènement du clic.
 */
const check = function (event) {
    event.preventDefault();
    jsonrpc.check().then(function () {
        notify(new PebkacError("success"));
    }).catch(notify);
};

// Pré-remplir les champs du formulaire.
browser.storage.local.get().then(function (config) {
    for (const [key, value] of Object.entries(config)) {
        const [form, name] = key.split("-");
        const inputs = document.querySelectorAll(`#${form} [name="${name}"]`);
        if (1 === inputs.length) {
            const input = inputs[0];
            if ("checkbox" === input.type) {
                input.checked = value;
            } else {
                input.value = value;
            }
        } else { // Sinon c'est un radio bouton.
            for (const input of inputs) {
                input.checked = value === input.value;
            }
        }
    }
    activate();
});

// Écouter les actions dans le formulaire.
for (const input of document.querySelectorAll("[name]")) {
    input.addEventListener("input", save);
}
document.getElementById("connection-check").addEventListener("click", check);
