/**
 * @license MIT
 * @see https://purgecss.com/configuration.html
 * @author Sébastien Règne
 */

export default {
    content: ["/src/popup/*.html", "/src/popup/*.js"],
    // Ajouter l'opérateur "&", car PurgeCSS ne gère pas correctement les
    // éléments imbriqués. https://github.com/FullHuman/purgecss/issues/1153
    safelist: { deep: [/^&/v] },
};
