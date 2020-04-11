/**
 * @module
 */

import { JSONRPC } from "../core/jsonrpc.js";

/**
 * Demande (ou enlève) une permission optionnelle.
 *
 * @param {HTMLInputElement} input La case à cocher.
 * @returns {Promise.<boolean>} Une promesse contenant l'état de la permission.
 */
const ask = async function (input) {
    if (!("permissions" in input.dataset)) {
        return input.checked;
    }

    const permissions = { permissions: [input.dataset.permissions] };
    if (input.checked) {
        return browser.permissions.request(permissions);
    }
    await browser.permissions.remove(permissions);
    return false;
};

/**
 * Vérifie la connexion à Kodi.
 *
 * @param {HTMLInputElement} input Le champ de l'adresse IP.
 */
const check = async function (input) {
    input.setCustomValidity("");
    input.removeAttribute("title");
    if (input.name.startsWith("host_")) {
        input.style.backgroundImage = `url("img/loading.svg")`;
        const host = input.value;
        try {
            await JSONRPC.check(host);
            // Indiquer la réussite si la valeur testée est toujours la valeur
            // renseignée. Si une autre valeur est en cours de vérification :
            // ignorer cette réussite.
            if (host === input.value) {
                input.style.backgroundImage = `url("img/connected.svg")`;
            }
        } catch (err) {
            // Afficher l'erreur si la valeur testée est toujours la valeur
            // renseignée. Si une autre valeur est en cours de vérification :
            // ignorer cette erreur.
            if (host === input.value) {
                if ("notFound" === err.type) {
                    input.title = err.message;
                    input.style.backgroundImage = `url("img/warning.svg")`;
                } else {
                    input.setCustomValidity(err.message);
                    input.style.backgroundImage = `url("img/invalid.svg")`;
                }
            }
        }
    } else if ((/^\s*$/u).test(input.value)) {
        input.setCustomValidity(
            browser.i18n.getMessage("options_serverName_error"),
        );
        input.style.backgroundImage = `url("img/invalid.svg")`;
    }
};

/**
 * Enregistre un paramètre.
 *
 * @this HTMLInputElement
 */
const save = async function () {
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
                    "server-active": 0,
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
        const checked = await ask(this);
        this.checked = checked;
        const inputs = this.form.querySelectorAll("input");
        if (1 === inputs.length) {
            browser.storage.local.set({ [key]: inputs[0].checked });
        } else {
            browser.storage.local.set({
                [key]: [...inputs].filter((i) => i.checked)
                                  .map((i) => i.name),
            });
        }
    } else {
        browser.storage.local.set({ [key]: this.value });
    }
};

/**
 * Enlève un serveur.
 *
 * @param {MouseEvent} event L'évènement du clic sur le bouton de la ligne.
 */
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

/**
 * Ajoute un serveur.
 *
 * @param {object} server Le serveur à ajouter.
 */
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
