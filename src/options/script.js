/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import "../polyfill/browser.js";
import "../polyfill/useragentdata.js";
import { Kodi } from "../core/jsonrpc/kodi.js";
import { locate } from "../core/l10n.js";
import { checkHosts } from "../core/permission.js";

// Insérer les textes dans la bonne langue.
locate(document, "options");

/**
 * Ouvre la boîte de dialogue d'aide et y affiche le texte de l'infobulle. Cette
 * fonctionnalité est utile pour les appareils tactiles, où il n'y a pas de
 * survol.
 *
 * @param {MouseEvent} event L'évènement du clic sur l'élément avec une
 *                           infobulle.
 */
const openHelp = (event) => {
    const element = event.target.closest("*[title]");
    const dialog = /** @type {HTMLDialogElement} */ (
        document.querySelector("#dialoghelp")
    );
    dialog.querySelector("p").textContent = element.title;
    // Afficher la boîte de dialogue un peu en dessous de l'élément cliqué, pour
    // éviter de masquer l'élément.
    dialog.style.marginTop = `${event.pageY + 32}px`;
    dialog.showModal();
};

/**
 * Demande l'accès à tous les sites Internet.
 */
const request = async () => {
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
const ask = async (input) => {
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
const check = async (input) => {
    const result = input.closest("div, td").querySelector("button.result");
    input.setCustomValidity("");
    if (input.name.startsWith("address_")) {
        input.removeAttribute("title");
        result.title = browser.i18n.getMessage(
            "options_serverResultLoading_title",
        );
        result.classList.remove("loading", "connected", "warning", "invalid");
        result.classList.add("loading");
        const address = input.value;

        const fix = input.closest("div, td").querySelector("button.fix");
        fix.dataset.fix = undefined;
        fix.disable = true;
        try {
            await Kodi.check(address);
            // Indiquer la réussite si la valeur testée est toujours la valeur
            // renseignée. Si une autre valeur est en cours de vérification :
            // ignorer cette réussite.
            if (address === input.value) {
                result.classList.remove(
                    "loading",
                    "connected",
                    "warning",
                    "invalid",
                );
                result.title = browser.i18n.getMessage(
                    "options_serverResultConnected_title",
                );
                result.classList.add("connected");
                fix.style.display = "none";
                input.classList.remove("fixable");
            }
        } catch (err) {
            // Afficher l'erreur si la valeur testée est toujours la valeur
            // renseignée. Si une autre valeur est en cours de vérification :
            // ignorer cette erreur.
            if (address === input.value) {
                if ("notFound" === err.type || "notSupported" === err.type) {
                    input.title = err.message;
                    result.title = err.message;
                    result.classList.remove(
                        "loading",
                        "connected",
                        "warning",
                        "invalid",
                    );
                    result.classList.add("warning");
                } else {
                    input.setCustomValidity(err.message);
                    result.title = err.message;
                    result.classList.remove(
                        "loading",
                        "connected",
                        "warning",
                        "invalid",
                    );
                    result.classList.add("invalid");
                }

                if (undefined === err.details.fix) {
                    fix.style.display = "none";
                    input.classList.remove("fixable");
                } else {
                    fix.dataset.fix = err.details.fix;
                    fix.disable = false;
                    input.classList.add("fixable");
                    fix.style.display = "inline-block";
                }
            }
        }
    } else if (/^\s*$/v.test(input.value)) {
        input.setCustomValidity(
            browser.i18n.getMessage("options_serverName_error"),
        );
        result.title = browser.i18n.getMessage("options_serverName_error");
        result.classList.remove("loading", "connected", "warning", "invalid");
        result.classList.add("invalid");
    } else {
        result.classList.remove("loading", "connected", "warning", "invalid");
    }
};

/**
 * Enregistre un paramètre.
 *
 * @param {InputEvent} event L'évènement d'un changement d'un champ.
 */
const save = async (event) => {
    const key = event.target.form.id;
    if ("server" === key) {
        if ("server-mode" === event.target.name) {
            const tab = event.target.closest("details");
            tab.open = true;
            if ("single" === event.target.value) {
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
            if ("address_0" === event.target.name) {
                for (const input of event.target.form.querySelectorAll(
                    'input[name="address_0"]',
                )) {
                    input.value = event.target.value;
                }
            }
            const list = [];
            for (const input of event.target.form.querySelectorAll(
                "tbody input",
            )) {
                const [type, position] = input.name.split("_");
                const index = Number(position);
                if (undefined === list[index]) {
                    list[index] = { [type]: input.value };
                } else {
                    list[index][type] = input.value;
                }
            }
            await browser.storage.local.set({ "server-list": list });
            event.target.form
                .querySelectorAll(`input[name="${event.target.name}"]`)
                .forEach(check);
        }
    } else if ("checkbox" === event.target.type) {
        // eslint-disable-next-line no-param-reassign
        event.target.checked = await ask(event.target);
        const inputs = event.target.form.querySelectorAll("input");
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
        await browser.storage.local.set({ [key]: event.target.value });
    }
};

/**
 * Corrige l'adresse renseignée.
 *
 * @param {MouseEvent} event L'évènement du clic sur le bouton de correction de
 *                           l'adresse.
 */
const fix = (event) => {
    const button = event.target.closest("button");
    const input = button.closest("div, td").querySelector("input");
    input.value = button.dataset.fix;
    // Déclencher manuellement l'évènement de modification du champ.
    input.dispatchEvent(new InputEvent("input"));
};

/**
 * Enlève un serveur.
 *
 * @param {MouseEvent} event L'évènement du clic sur le bouton de suppression de
 *                           la ligne.
 */
const remove = async (event) => {
    const table = document.querySelector("table");
    // Enlever la ligne du serveur.
    table.deleteRow(event.target.closest("tr").rowIndex);

    // Recalculer les index des champs pour chaque ligne.
    let index = 0;
    for (const tr of table.querySelectorAll("tbody tr")) {
        for (const input of tr.querySelectorAll("input")) {
            input.name = input.name.replace(/_\d+$/v, `_${index.toString()}`);
        }
        ++index;
    }

    // Si un seul serveur est présent dans la liste : désactiver le bouton de
    // suppression.
    if (1 === table.querySelectorAll("tbody tr").length) {
        table.querySelector("button.remove").disabled = true;
    }

    // Simuler une modification de la première adresse pour enregistrer la
    // nouvelle configuration.
    table
        .querySelector('[name="address_0"]')
        .dispatchEvent(new InputEvent("input"));
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
const add = (server) => {
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
        // Ne pas attendre le retour de la vérification.
        check(single);
        tr.querySelector("button.remove").disabled = true;
    } else {
        document.querySelector("tbody button.remove").disabled = false;
    }

    const name = tr.querySelector('[name="name_"]');
    if ("name" in server) {
        name.value = server.name;
    }
    name.name += index.toString();
    name.addEventListener("input", save);

    tr.querySelector("button.result").addEventListener("click", openHelp);
    tr.querySelector("button.fix").addEventListener("click", fix);
    tr.querySelector("button.remove").addEventListener("click", remove);

    document.querySelector("tbody").append(tr);

    // Vérifier la connexion à Kodi sans attendre le retour de la vérification.
    check(address);
};

/**
 * Remplit les champs du formulaire avec la configuration.
 *
 * @param {Object} config La configuration.
 */
const load = (config) => {
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
const handleRemove = (permissions) => {
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
const handleChange = (changes) => {
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

if (navigator.userAgentData.mobile) {
    document.querySelector("#popup-wheel").style.display = "none";
}

if (undefined === browser.contextMenus) {
    // Si le navigateur ne supporte pas la modification des menus contextuels
    // (comme dans Firefox Android) : désactiver toutes les cases à cocher.
    // https://bugzil.la/1595822
    document.querySelector(".warning").style.display = "block";
    for (const input of document.querySelectorAll(
        "#menu-actions input, #menu-contexts input",
    )) {
        input.disabled = true;
    }
} else {
    // Si le navigateur supporte la modification des menus contextuels, enlever
    // les contextes non-disponibles dans certains navigateurs : "bookmark" et
    // "tab" dans Chromium. https://issues.chromium.org/41378677
    // https://issues.chromium.org/40246822
    const contextTypes = new Set(
        Object.values(browser.contextMenus.ContextType),
    );
    for (const input of document.querySelectorAll("#menu-contexts input")) {
        if (!contextTypes.has(input.name)) {
            input.parentElement.remove();
        }
    }
}

document.querySelector("#permission button").addEventListener("click", request);
try {
    await checkHosts();
} catch {
    document.querySelector("#permission").style.display = "block";
}

// Remplir les champs du formulaire avec la configuration.
load(await browser.storage.local.get());

// Écouter les actions dans le formulaire.
for (const input of document.querySelectorAll("[name]")) {
    input.addEventListener("input", save);
}
document.querySelector("#server-add").addEventListener("click", add);
document.querySelector("button.result").addEventListener("click", openHelp);
document.querySelector("button.fix").addEventListener("click", fix);

// Écouter les clics sur les aides.
for (const sup of document.querySelectorAll("sup")) {
    sup.addEventListener("click", openHelp);
}

// Surveiller des changements de permissions (pour le droit de requêter les
// sites Internet).
browser.permissions.onRemoved.addListener(handleRemove);

// Surveiller des changements dans la configuration (qui peuvent arriver si
// l'utilisateur enlève une permission optionnelle).
browser.storage.onChanged.addListener(handleChange);
