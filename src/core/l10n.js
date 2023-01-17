/**
 * @module
 */

/**
 * Recherche les attributs liés à la localisation.
 *
 * @param {Document} doc Le document HTML.
 * @returns {Attr[]} La liste des attributs.
 */
const search = function (doc) {
    const results = doc.evaluate(
        "//@*[starts-with(name(), 'data-l10n-')]",
        doc,
        // eslint-disable-next-line unicorn/no-null
        null,
        XPathResult.ANY_TYPE,
        // eslint-disable-next-line unicorn/no-null
        null,
    );
    const attributes = [];
    for (let attribut = results.iterateNext();
            null !== attribut;
            attribut = results.iterateNext()) {
        attributes.push(attribut);
    }
    return attributes;
};

/**
 * Recherche les attributs liés à la localisation dans des éléments
 * <code>&lt;template&gt;</code>.
 *
 * @param {Document|DocumentFragment} doc Le document HTML.
 * @returns {Attr[]} La liste des attributs.
 */
const searchInTemplate = function (doc) {
    const attributes = [];
    for (const template of doc.querySelectorAll("template")) {
        attributes.push(...searchInTemplate(template.content));
        for (const element of template.content.querySelectorAll("*")) {
            attributes.push(
                ...Array.from(element.attributes)
                        .filter((a) => a.name.startsWith("data-l10n-")),
            );
        }
    }
    return attributes;
};

/**
 * Insère les textes dans les éléments marqués par des attributs
 * <code>data-l10n-*</code>.
 *
 * @param {Document} doc  Le document HTML.
 * @param {string}   page Le nom de la page (utilisé pour récupérer les
 *                        messages).
 * @throws {Error} Si un attribut n'a pas de valeur.
 */
export const locate = function (doc, page) {
    const attributes = [...search(doc), ...searchInTemplate(doc)];
    for (const attribute of attributes) {
        const place = attribute.name.slice(10);
        let key;
        if ("" !== attribute.value) {
            key = attribute.value;
        } else if (attribute.ownerElement.hasAttribute("id")) {
            key = attribute.ownerElement.id;
        } else {
            throw new Error("[data-l10n-*] without value");
        }
        key = key.replaceAll(/-./gu, (m) => m[1].toUpperCase());

        const value = browser.i18n.getMessage(`${page}_${key}_${place}`);

        if ("textcontent" === place) {
            if (0 === attribute.ownerElement.children.length) {
                attribute.ownerElement.textContent = value;
            } else {
                for (const node of attribute.ownerElement.childNodes) {
                    if ("#text" === node.nodeName) {
                        node.nodeValue = node.nodeValue.replace("{}", value);
                    }
                }
            }
        } else {
            attribute.ownerElement.setAttribute(place, value);
        }
    }
};
