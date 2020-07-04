/**
 * @module
 */

import { Kodi } from "../core/jsonrpc/kodi.js";

/**
 * Demande (ou enlève) une permission optionnelle.
 *
 * @param {HTMLInputElement} input La case à cocher.
 * @returns {Promise.<boolean>} Une promesse contenant le nouvel état de la
 *                              permission.
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
 * @param {HTMLInputElement} input Le champ de l'adresse.
 */
const check = async function (input) {
    input.setCustomValidity("");
    input.removeAttribute("title");
    if (input.name.startsWith("address_")) {
        input.style.backgroundImage = `url("img/loading.svg")`;
        const address = input.value;
        try {
            await Kodi.check(address);
            // Indiquer la réussite si la valeur testée est toujours la valeur
            // renseignée. Si une autre valeur est en cours de vérification :
            // ignorer cette réussite.
            if (address === input.value) {
                input.style.backgroundImage = `url("img/connected.svg")`;
            }
        } catch (err) {
            // Afficher l'erreur si la valeur testée est toujours la valeur
            // renseignée. Si une autre valeur est en cours de vérification :
            // ignorer cette erreur.
            if (address === input.value) {
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
    } else {
        input.style.backgroundImage = "none";
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
            const tab = this.closest("details");
            tab.open = true;
            if ("single" === this.value) {
                // Modifier la configuration en une fois pour éviter d'appeler
                // les auditeurs à chaque changement.
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
            // Synchroniser les deux champs de l'adresse du premier serveur.
            if ("address_0" === this.name) {
                for (const input of
                        this.form.querySelectorAll(`input[name="address_0"]`)) {
                    input.value = this.value;
                }
            }
            const list = [];
            for (const input of this.form.querySelectorAll(`tbody input`)) {
                const [type, position] = input.name.split("_");
                const index = Number(position);
                if (undefined === list[index]) {
                    list[index] = { [type]: input.value };
                } else {
                    list[index][type] = input.value;
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
    document.querySelector("table")
            .deleteRow(event.target.closest("tr").rowIndex);

    // Recalculer les index.
    let index = 0;
    for (const tr of document.querySelectorAll("tbody tr")) {
        for (const input of tr.querySelectorAll("input")) {
            const type = input.name.slice(0, input.name.indexOf("_"));
            input.name = type + "_" + index.toString();
        }
        ++index;
    }

    // Si un seul serveur est présent dans la liste : désactiver le bouton pour
    // le supprimer.
    if (1 === document.querySelectorAll("tbody tr").length) {
        document.querySelector("tbody button").disabled = true;
    }

    // Enregistrer la nouvelle configuration.
    save.bind(tbody.querySelector(`[name="address_0"]`))();
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
    const address = tr.querySelector(`[name="address_"]`);
    if ("address" in server) {
        address.value = server.address;
    }
    address.name += index.toString();
    address.addEventListener("input", save);
    if (0 === index) {
        const single = document.querySelector(`[name="address_0"]`);
        single.value = server.address;
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
    check(address);

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
                const tab = input.closest("details");
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
