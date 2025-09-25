/**
 * @license MIT
 * @see https://purgecss.com/configuration.html
 * @author Sébastien Règne
 */

export default {
    content: ["/src/options/*.html", "/src/options/*.js"],
    // Ajouter l'opérateur "&", car PurgeCSS ne gère pas correctement les
    // éléments imbriqués. https://github.com/FullHuman/purgecss/issues/1153
    safelist: { deep: [/^&/v] },
};
