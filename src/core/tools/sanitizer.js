/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * Protège les caractères spéciaux d'une chaine de caractères pour les
 * expressions rationnelles.
 *
 * @param {string} pattern La chaine de caractères.
 * @returns {string} La chaine de caractères avec les caractères spéciaux
 *                   protégés.
 * @see https://developer.mozilla.org/Web/JavaScript/Guide/Regular_expressions
 */
export const quote = function (pattern) {
    return pattern.replaceAll(/[$()*+.?[\\\]^{|}]/gu, "\\$&");
};

/**
 * Enlève les balises utilisées par Kodi pour mettre en forme des textes.
 *
 * @param {string} text Le texte qui sera nettoyé.
 * @returns {string} Le texte nettoyé.
 * @see https://kodi.wiki/view/Label_Formatting
 */
export const strip = function (text) {
    return text
        .replaceAll(/\[B\](?<t>.*?)\[\/B\]/gu, "$<t>")
        .replaceAll(/\[I\](?<t>.*?)\[\/I\]/gu, "$<t>")
        .replaceAll(/\[LIGHT\](?<t>.*?)\[\/LIGHT\]/gu, "$<t>")
        .replaceAll(/\[COLOR [^\]]+\](?<t>.*?)\[\/COLOR\]/gu, "$<t>")
        .replaceAll(/\[UPPERCASE\](?<t>.*?)\[\/UPPERCASE\]/gu, (_, t) =>
            t.toUpperCase(),
        )
        .replaceAll(/\[LOWERCASE\](?<t>.*?)\[\/LOWERCASE\]/gu, (_, t) =>
            t.toLowerCase(),
        )
        .replaceAll(
            /\[CAPITALIZE\](?<t>.*?)\[\/CAPITALIZE\]/gu,
            (_, t) => t.charAt(0).toUpperCase() + t.slice(1),
        )
        .replaceAll("[CR]", " ")
        .replaceAll(/\[TABS\](?<n>\d+)\[\/TABS\]/gu, (_, n) =>
            "\t".repeat(Number(n)),
        )
        .trim();
};
