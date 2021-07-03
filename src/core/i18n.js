/**
 * @module
 */

/**
 * Le nom de la page courante (récupérée à partir du répertoire).
 *
 * @type {string}
 */
const PAGE = location.pathname.slice(1, location.pathname.indexOf("/", 1));

/**
 * La liste de tous les élements de la page courante (même ceux dans un
 * <code>template</code>).
 *
 * @type {HTMLElement[]}
 */
const elements = [...document.querySelectorAll("*")].flatMap((element) => {
    return "TEMPLATE" === element.nodeName
                                    ? [...element.content.querySelectorAll("*")]
                                    : element;
});

for (const element of elements) {
    for (const attribute of element.attributes) {
        if (!attribute.name.startsWith("data-i18n-")) {
            continue;
        }

        const place = attribute.name.slice(10);
        let key;
        if ("" !== attribute.value) {
            key = attribute.value;
        } else if (element.hasAttribute("id")) {
            key = element.id;
        } else {
            throw new Error("[data-i18n-*] without value");
        }
        key = key.replace(/-./gu, (m) => m[1].toUpperCase());

        const value = browser.i18n.getMessage(PAGE + "_" + key + "_" + place);

        if ("textcontent" === place) {
            if (0 === element.children.length) {
                element.textContent = value;
            } else {
                for (const node of element.childNodes) {
                    if ("#text" === node.nodeName) {
                        node.nodeValue = node.nodeValue.replace("{}", value);
                    }
                }
            }
        } else {
            element.setAttribute(place, value);
        }
    }
}
