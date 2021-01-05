/**
 * @module
 */

/**
 * Enlève les balises de mise en forme.
 *
 * @function
 * @param {string} text Le texte qui sera nettoyé.
 * @returns {string} Le textenettoyé.
 */
export const strip = function (text) {
    return text.replaceAll(/\[B\](.*?)\[\/B\]/gu, "$1")
               .replaceAll(/\[I\](.*?)\[\/I\]/gu, "$1")
               .replaceAll(/\[LIGHT\](.*?)\[\/LIGHT\]/gu, "$1")
               .replaceAll(/\[COLOR [^\]]+\](.*?)\[\/COLOR\]/gu, "$1")
               .replaceAll(/\[UPPERCASE\](.*?)\[\/UPPERCASE\]/gu, "$1")
               .replaceAll(/\[LOWERCASE\](.*?)\[\/LOWERCASE\]/gu, "$1")
               .replaceAll(/\[CAPITALIZE\](.*?)\[\/CAPITALIZE\]/gu, "$1")
               .replaceAll("[CR]", " ")
               .trim();
};
