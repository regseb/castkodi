/**
 * @module
 */

const page = location.pathname.substring(1, location.pathname.indexOf("/", 1));

for (const element of document.querySelectorAll("*")) {
    for (const attribute of element.attributes) {
        if (!attribute.name.startsWith("data-i18n-")) {
            continue;
        }

        const place = attribute.name.substring(10);
        let key;
        if ("" !== attribute.value) {
            key = attribute.value;
        } else if (element.hasAttribute("id")) {
            key = element.id;
        } else {
            throw new Error("[data-i18n-*] without value");
        }
        key = key.replace(/-./gu, (m) => m[1].toUpperCase());

        const value = browser.i18n.getMessage(page + "_" + key + "_" +
                                              place);

        if ("textcontent" === place) {
            if (0 === element.children.length) {
                element.textContent = value;
            } else {
                for (const node of element.childNodes) {
                    if ("#text" !== node.nodeName) {
                        continue;
                    }
                    node.nodeValue = node.nodeValue.replace("{}", value);
                }
            }
        } else {
            element.setAttribute(place, value);
        }
    }
}
