/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * Recherche les attributs liés à la localisation.
 *
 * @param {Document | DocumentFragment} doc Le document HTML ou un fragment de
 *                                          document dans un template.
 * @returns {Attr[]} La liste des attributs.
 */
const search = (doc) => {
    const attributes = [];
    for (const element of doc.querySelectorAll("*")) {
        attributes.push(
            ...Array.from(element.attributes).filter((a) =>
                a.name.startsWith("data-l10n-"),
            ),
        );
        if ("TEMPLATE" === element.tagName) {
            attributes.push(
                ...search(/** @type {HTMLTemplateElement} */ (element).content),
            );
        }
    }
    return attributes;
};

/**
 * Insère les textes dans les éléments marqués par des attributs `data-l10n-*`.
 *
 * @param {Document} doc  Le document HTML.
 * @param {string}   page Le nom de la page (utilisé pour récupérer les
 *                        messages).
 * @throws {Error} Si un attribut n'a pas de valeur.
 */
export const locate = (doc, page) => {
    for (const attribute of search(doc)) {
        const place = attribute.name.slice(10);
        let key;
        if ("" !== attribute.value) {
            key = attribute.value;
        } else if (attribute.ownerElement.hasAttribute("id")) {
            key = attribute.ownerElement.id;
        } else if (attribute.ownerElement.hasAttribute("name")) {
            key = attribute.ownerElement.getAttribute("name");
        } else if (attribute.ownerElement.hasAttribute("value")) {
            key = attribute.ownerElement.getAttribute("value");
        } else {
            throw new Error("[data-l10n-*] without value");
        }
        key = key.replaceAll(/-./gv, (m) => m[1].toUpperCase());

        const value = browser.i18n.getMessage(`${page}_${key}_${place}`);

        if ("textcontent" === place) {
            if (0 === attribute.ownerElement.children.length) {
                attribute.ownerElement.textContent = value;
            } else {
                for (const node of attribute.ownerElement.childNodes) {
                    if ("#text" === node.nodeName) {
                        node.nodeValue = node.nodeValue.replace(
                            "{}",
                            () => value,
                        );
                    }
                }
            }
        } else {
            attribute.ownerElement.setAttribute(place, value);
        }
    }
};
