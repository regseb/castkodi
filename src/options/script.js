/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import "../polyfill/browser.js";
// eslint-disable-next-line import/no-unassigned-import
import "../core/css.js";
import { Kodi } from "../core/jsonrpc/kodi.js";
import { locate } from "../core/l10n.js";
import { checkHosts } from "../core/permission.js";

// Insérer les textes dans la bonne langue.
locate(document, "options");

/**
 * Demande l'accès à tous les sites Internet.
 */
const request = async function () {
    const granted = await browser.permissions.request({
        origins: ["<all_urls>"],
    });
    if (granted) {
        document.querySelector("#permission").style.display = "none";
    }
};

/**
 * Demande (ou enlève) éventuellement une permission optionnelle.
 *
 * @param {HTMLInputElement} input La case à cocher.
 * @returns {Promise<boolean>} Une promesse contenant le nouvel état de la
 *                             permission.
 */
const ask = async function (input) {
    if (!("permissions" in input.dataset)) {
        return input.checked;
    }

    const permissions = {
        permissions: [/** @type {string} */ (input.dataset.permissions)],
    };
    if (input.checked) {
        return await browser.permissions.request(permissions);
    }
    await browser.permissions.remove(permissions);
    return false;
};

/**
 * Vérifie la connexion à Kodi ; ou le nom du serveur.
 *
 * @param {HTMLInputElement} input Le champ de l'adresse ou du nom.
 */
const check = async function (input) {
    input.setCustomValidity("");
    if (input.name.startsWith("address_")) {
        input.removeAttribute("title");
        input.style.backgroundImage = 'url("/design/icon/loading-gray.svg")';
        const address = input.value;
        try {
            await Kodi.check(address);
            // Indiquer la réussite si la valeur testée est toujours la valeur
            // renseignée. Si une autre valeur est en cours de vérification :
            // ignorer cette réussite.
            if (address === input.value) {
                input.style.backgroundImage =
                    'url("/design/icon/connected-green.svg")';
            }
        } catch (err) {
            // Afficher l'erreur si la valeur testée est toujours la valeur
            // renseignée. Si une autre valeur est en cours de vérification :
            // ignorer cette erreur.
            if (address === input.value) {
                if ("notFound" === err.type || "notSupported" === err.type) {
                    input.title = err.message;
                    input.style.backgroundImage =
                        'url("/design/icon/warning-yellow.svg")';
                } else {
                    input.setCustomValidity(err.message);
                    input.style.backgroundImage =
                        'url("/design/icon/invalid-red.svg")';
                }
            }
        }
    } else if (/^\s*$/u.test(input.value)) {
        input.setCustomValidity(
            browser.i18n.getMessage("options_serverName_error"),
        );
        input.style.backgroundImage = 'url("/design/icon/invalid-red.svg")';
    } else {
        input.style.backgroundImage = "none";
    }
};

/**
 * Enregistre un paramètre.
 *
 * @this {HTMLInputElement}
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
                await browser.storage.local.set({
                    "server-mode": "single",
                    "server-active": 0,
                });
                tab.nextElementSibling.open = false;
            } else {
                await browser.storage.local.set({ "server-mode": "multi" });
                tab.previousElementSibling.open = false;
            }
        } else {
            // Synchroniser les deux champs de l'adresse du premier serveur.
            if ("address_0" === this.name) {
                for (const input of this.form.querySelectorAll(
                    'input[name="address_0"]',
                )) {
                    input.value = this.value;
                }
            }
            const list = [];
            for (const input of this.form.querySelectorAll("tbody input")) {
                const [type, position] = input.name.split("_");
                const index = Number(position);
                if (undefined === list[index]) {
                    list[index] = { [type]: input.value };
                } else {
                    list[index][type] = input.value;
                }
            }
            await browser.storage.local.set({ "server-list": list });
            this.form
                .querySelectorAll(`input[name="${this.name}"]`)
                .forEach(check);
        }
    } else if ("checkbox" === this.type) {
        this.checked = await ask(this);
        const inputs = this.form.querySelectorAll("input");
        if (1 === inputs.length) {
            await browser.storage.local.set({ [key]: inputs[0].checked });
        } else {
            await browser.storage.local.set({
                [key]: Array.from(inputs)
                    .filter((i) => i.checked)
                    .map((i) => i.name),
            });
        }
    } else {
        await browser.storage.local.set({ [key]: this.value });
    }
};

/**
 * Enlève un serveur.
 *
 * @param {MouseEvent} event L'évènement du clic sur le bouton de la ligne.
 */
const remove = async function (event) {
    const tbody = document.querySelector("tbody");
    // Enlever la ligne.
    document
        .querySelector("table")
        .deleteRow(event.target.closest("tr").rowIndex);

    // Recalculer les index.
    let index = 0;
    for (const tr of document.querySelectorAll("tbody tr")) {
        for (const input of tr.querySelectorAll("input")) {
            input.name = input.name.replace(/_\d+$/u, `_${index.toString()}`);
        }
        ++index;
    }

    // Si un seul serveur est présent dans la liste : désactiver le bouton de
    // suppression.
    if (1 === document.querySelectorAll("tbody tr").length) {
        document.querySelector("tbody button").disabled = true;
    }

    // Enregistrer la nouvelle configuration.
    await save.apply(tbody.querySelector('[name="address_0"]'));
    // Activer le premier serveur, car c'est peut-être le serveur actif qui a
    // été supprimé.
    await browser.storage.local.set({ "server-active": 0 });
};

/**
 * Ajoute un serveur.
 *
 * @param {Object} server         Le serveur à ajouter.
 * @param {string} server.address L'adresse du serveur.
 * @param {string} server.name    Le nom du serveur.
 */
const add = function (server) {
    const index = document.querySelectorAll("tbody tr").length;

    const tr = document.querySelector("template").content.cloneNode(true);
    const address = tr.querySelector('[name="address_"]');
    if ("address" in server) {
        address.value = server.address;
    }
    address.name += index.toString();
    address.addEventListener("input", save);
    if (0 === index) {
        const single = document.querySelector('[name="address_0"]');
        single.value = server.address;
        check(single);
        tr.querySelector("button").disabled = true;
    } else {
        document.querySelector("tbody button").disabled = false;
    }

    const name = tr.querySelector('[name="name_"]');
    if ("name" in server) {
        name.value = server.name;
    }
    name.name += index.toString();
    name.addEventListener("input", save);

    tr.querySelector("button").addEventListener("click", remove);

    document.querySelector("tbody").append(tr);

    // Vérifier la connexion à Kodi.
    check(address);
};

/**
 * Remplit les champs du formulaire avec la configuration.
 *
 * @param {Object} config La configuration.
 */
const load = function (config) {
    for (const [key, value] of Object.entries(config)) {
        if ("server-list" === key) {
            value.forEach(add);
        } else if ("server-mode" === key) {
            for (const input of document.querySelectorAll(
                'input[name="server-mode"]',
            )) {
                const tab = input.closest("details");
                input.checked = value === input.value;
                tab.open = input.checked;
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
};

/**
 * Affiche le message d'erreur si la permission pour requêter les sites Internet
 * est enlevée.
 *
 * @param {browser.permissions.Permissions} permissions Les permissions
 *                                                      supprimées.
 */
const handleRemove = function (permissions) {
    if (permissions.origins?.includes("<all_urls>")) {
        document.querySelector("#permission").style.display = "block";
    }
};

/**
 * Actualise les champs du formulaire quand la configuration change.
 *
 * @param {browser.storage.StorageChange} changes Les paramètres modifiés dans
 *                                                la configuration.
 */
const handleChange = function (changes) {
    load(
        Object.fromEntries(
            Object.entries(changes)
                .filter(([, v]) => "newValue" in v)
                // Ignorer "server-active", car ce paramètre n'est pas affiché
                // dans la page.
                .filter(([k]) => "server-active" !== k)
                // Ne pas actualiser la liste des serveurs, car cela provoque un
                // bogue.
                .filter(([k]) => "server-list" !== k)
                .map(([k, v]) => [k, v.newValue]),
        ),
    );
};

document.querySelector("#permission button").addEventListener("click", request);
try {
    await checkHosts();
} catch {
    document.querySelector("#permission").style.display = "block";
}

// Remplir les champs du formulaire avec la configuration.
load(await browser.storage.local.get());

// Activer les contextes disponibles seulement dans certains navigateurs.
const info = await browser.runtime.getBrowserInfo();
for (const label of document.querySelectorAll(
    `label[data-supported-browser="${info.name}"]`,
)) {
    delete label.dataset.supportedBrowser;
}

// Écouter les actions dans le formulaire.
for (const input of document.querySelectorAll("[name]")) {
    input.addEventListener("input", save);
}
document.querySelector("#server-add").addEventListener("click", add);

// Surveiller des changements de permissions (pour le droit de requêter les
// sites Internet).
browser.permissions.onRemoved.addListener(handleRemove);

// Surveiller des changements dans la configuration (qui peuvent arriver si
// l'utilisateur enlève une permission optionnelle).
browser.storage.onChanged.addListener(handleChange);
