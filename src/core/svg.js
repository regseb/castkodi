/**
 * @module
 */

/**
 * La liste de tous les élements <code>object</code> de la page courante (même
 * ceux dans un <code>template</code>).
 *
 * @type {HTMLObjectElement[]}
 */
const objects = [...document.querySelectorAll("object"),
                  ...[...document.querySelectorAll("template")]
                    .flatMap((t) => [...t.content.querySelectorAll("object")])];

// Insérer le code SVG des icônes dans la page pour pouvoir changer leur couleur
// avec la feuille de style.
for (const object of objects) {
    fetch(object.data).then((r) => r.text())
                      .then((text) => {
        const svg = new DOMParser().parseFromString(text, "image/svg+xml");
        object.append(svg.documentElement);
        object.removeAttribute("data");
    });
}
