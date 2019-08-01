/**
 * @module
 */

const page = location.pathname.substring(1, location.pathname.indexOf("/", 1));

for (const element of document.querySelectorAll("*")) {
    for (const attribute of element.attributes) {
        if (attribute.name.startsWith("data-i18n-")) {
            const place = attribute.name.substring(10);
            let key;
            if ("" !== attribute.value) {
                key = attribute.value;
            } else if (element.hasAttribute("id")) {
                key = element.id;
            } else if (element.hasAttribute("for")) {
                key = element.htmlFor;
            } else {
                throw new Error("[data-i18n-*] without value");
            }
            key = key.replace(/-./gu, (m) => m[1].toUpperCase());

            const value = browser.i18n.getMessage(page + "_" + key + "_" +
                                                  place);

            if ("textcontent" === place) {
                element.textContent = value;
            } else {
                element.setAttribute(place, value);
            }
        }
    }
}
