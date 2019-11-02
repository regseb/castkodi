/**
 * @module
 */

import { JSONRPC } from "../core/jsonrpc.js";

/**
 * Demande (ou enlève) une permission optionnelle.
 *
 * @function ask
 * @param {HTMLInputElement} input La case à cocher.
 */
const ask = function (input) {
    if (!("permissions" in input.dataset)) {
        return Promise.resolve(input.checked);
    }

    const permissions = { "permissions": [input.dataset.permissions] };
    if (input.checked) {
        return browser.permissions.request(permissions).then((response) => {
            input.checked = response;
            return response;
        });
    }
    return browser.permissions.remove(permissions).then(() => false);
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
    if (input.name.startsWith("host_")) {
        input.style.backgroundImage = `url("img/loading.svg")`;
        const host = input.value;
        JSONRPC.check(host).then(() => {
            // Indiquer la réussite si la valeur testée est toujours la valeur
            // renseignée. Si une autre valeur est en cours de vérification :
            // ignorer cette réussite.
            if (host === input.value) {
                input.style.backgroundImage = `url("img/connected.svg")`;
            }
        }).catch((err) => {
            // Afficher l'erreur si la valeur testée est toujours la valeur
            // renseignée. Si une autre valeur est en cours de vérification :
            // ignorer cette erreur.
            if (host === input.value) {
                input.title = err.message;
                if ("notFound" === err.type) {
                    input.style.backgroundImage = `url("img/warning.svg")`;
                } else {
                    input.setCustomValidity(err.message);
                    input.style.backgroundImage = `url("img/invalid.svg")`;
                }
            }
        });
    } else if ((/^\s*$/u).test(input.value)) {
        input.title = "Le nom du serveur n'est pas renseigné.";
        input.setCustomValidity(input.title);
        input.style.backgroundImage = `url("img/invalid.svg")`;
    }
};

/**
 * Enregistre un paramètre.
 *
 * @function save
 * @this HTMLInputElement
 */
const save = function () {
    const key = this.form.id;
    if ("server" === key) {
        if ("server-mode" === this.name) {
            const tab = this.parentElement.parentElement.parentElement;
            tab.open = true;
            if ("single" === this.value) {
                // Modifier la configuration en une fois pour éviter d'appeler
                // les écouteurs à chaque changement.
                browser.storage.local.set({
                    "server-mode":   "single",
                    "server-active": 0
                });
                tab.nextElementSibling.open = false;
            } else {
                browser.storage.local.set({ "server-mode": "multi" });
                tab.previousElementSibling.open = false;
            }
        } else {
            // Synchroniser les deux champs de l'adresse IP du premier serveur.
            if ("host_0" === this.name) {
                for (const input of
                           this.form.querySelectorAll(`input[name="host_0"]`)) {
                    input.value = this.value;
                }
            }
            const list = [];
            for (const input of this.form.querySelectorAll(`tbody input`)) {
                const index = Number(input.name.slice(5));
                if (undefined === list[index]) {
                    list[index] = { [input.name.slice(0, 4)]: input.value };
                } else {
                    list[index][input.name.slice(0, 4)] = input.value;
                }
            }
            browser.storage.local.set({ "server-list": list });
            this.form.querySelectorAll(`input[name="${this.name}"]`)
                     .forEach(check);
        }
    } else if ("checkbox" === this.type) {
        ask(this).then((checked) => {
            const inputs = this.form.querySelectorAll("input");
            if (1 === inputs.length) {
                browser.storage.local.set({ [key]: checked });
            } else {
                browser.storage.local.set({
                    [key]: [...inputs].filter((i) => i.checked)
                                      .map((i) => i.name)
                });
            }
        });
    } else {
        browser.storage.local.set({ [key]: this.value });
    }
};

const remove = function (event) {
    const tbody = document.querySelector("tbody");
    // Enlever la ligne.
    let row;
    if ("BUTTON" === event.target.tagName) {
        row = event.target.parentElement.parentElement;
    } else {
        row = event.target.parentElement.parentElement.parentElement;
    }
    document.querySelector("table").deleteRow(row.rowIndex);

    // Recalculer les index.
    let index = 0;
    for (const tr of document.querySelectorAll("tbody tr")) {
        for (const input of tr.querySelectorAll("input")) {
            input.name = input.name.slice(0, 5) + index.toString();
        }
        ++index;
    }

    if (1 === document.querySelectorAll("tbody tr").length) {
        document.querySelector("tbody button").disabled = true;
    }

    // Enregistrer la nouvelle configuration.
    save.bind(tbody.querySelector(`[name="host_0"]`))();
    return false;
};

const add = function (server) {
    const index = document.querySelectorAll("tbody tr").length;

    const tr = document.querySelector("template").content.cloneNode(true);
    const host = tr.querySelector(`[name="host_"]`);
    if ("host" in server) {
        host.value = server.host;
    }
    host.name += index.toString();
    host.addEventListener("input", save);
    if (0 === index) {
        const single = document.querySelector(`[name="host_0"]`);
        single.value = server.host;
        check(single);
        tr.querySelector("button").disabled = true;
    } else {
        document.querySelector("tbody button").disabled = false;
    }

    const name = tr.querySelector(`[name="name_"]`);
    if ("name" in server) {
        name.value = server.name;
    }
    name.name += index.toString();
    name.addEventListener("input", save);

    tr.querySelector("button").addEventListener("click", remove);

    document.querySelector("tbody").append(tr);

    // Vérifier la connexion à Kodi.
    check(host);

    return false;
};

// Remplir les champs du formulaire.
browser.storage.local.get().then((config) => {
    for (const [key, value] of Object.entries(config)) {
        if ("server-list" === key) {
            value.forEach(add);
        } else if ("server-mode" === key) {
            for (const input of document
                               .querySelectorAll(`input[name="server-mode"]`)) {
                const tab = input.parentElement.parentElement.parentElement;
                if (value === input.value) {
                    input.checked = true;
                    tab.open = true;
                } else {
                    input.checked = false;
                    tab.open = false;
                }
            }
        } else if (Array.isArray(value)) {
            for (const input of document.querySelectorAll(`#${key} input`)) {
                input.checked = value.includes(input.name);
            }
        } else if ("boolean" === typeof value) {
            document.querySelector(`#${key} input`).checked = value;
        } else if ("string" === typeof value) {
            for (const input of document.querySelectorAll(`#${key} input`)) {
                input.checked = value === input.value;
            }
        }
    }
});

// Écouter les actions dans le formulaire.
for (const input of document.querySelectorAll("[name]")) {
    input.addEventListener("input", save);
}
document.querySelector("button").addEventListener("click", add);
