/**
 * @module options/script
 */

import { JSONRPC } from "../core/jsonrpc.js";

/**
 * Demande (ou enlève) une permission optionnelle.
 *
 * @function ask
 * @param {HTMLInputElement} input La case à cocher.
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
 * Vérifie la connexion à Kodi.
 *
 * @function check
 * @param {HTMLInputElement} input Le champ de l'adresse IP.
 */
const check = function (input) {
    input.setCustomValidity("");
    input.removeAttribute("title");
    input.style.backgroundImage = `url("img/loading.svg")`;
    const host = input.value;
    JSONRPC.check(host).then(() => {
        // Indiquer la réussite si la valeur testée est toujours la valeur
        // renseignée. Si une autre valeur est en cours de vérification :
        // ignorer celle-ci.
        if (host === input.value) {
            input.setCustomValidity("");
            input.removeAttribute("title");
            input.style.backgroundImage = `url("img/valid.svg")`;
            document.querySelector(".warning").style.display = "none";
        }
    }).catch((err) => {
        // Afficher l'erreur si la valeur testée est toujours la valeur
        // renseignée. Si une autre valeur est en cours de vérification :
        // ignorer celle-ci.
        if (host === input.value) {
            input.setCustomValidity(err.message);
            input.title = err.message;
            input.style.backgroundImage = `url("img/invalid.svg")`;
            if ("notFound" === err.type) {
                document.querySelector(".warning").style.display = "block";
            } else {
                document.querySelector(".warning").style.display = "none";
            }
        }
    });
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
    } else {
        browser.storage.local.set({ [key]: this.value });
        if ("connection-host" === key) {
            check(this);
        }
    }
};

// Pré-remplir les champs du formulaire.
browser.storage.local.get().then((config) => {
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

    // Vérifier la connexion à Kodi.
    check(document.querySelector("#connection-host"));
});

// Écouter les actions dans le formulaire.
for (const input of document.querySelectorAll("[name]")) {
    input.oninput = save;
}
