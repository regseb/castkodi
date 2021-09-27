/**
 * @module
 */

/**
 * Enlève les balises utilisées par Kodi pour mettre en forme des textes.
 *
 * @param {string} text Le texte qui sera nettoyé.
 * @returns {string} Le texte nettoyé.
 */
export const strip = function (text) {
    return text.replaceAll(/\[B\](?<t>.*?)\[\/B\]/gu, "$<t>")
               .replaceAll(/\[I\](?<t>.*?)\[\/I\]/gu, "$<t>")
               .replaceAll(/\[LIGHT\](?<t>.*?)\[\/LIGHT\]/gu, "$<t>")
               .replaceAll(/\[COLOR [^\]]+\](?<t>.*?)\[\/COLOR\]/gu, "$<t>")
               .replaceAll(/\[UPPERCASE\](?<t>.*?)\[\/UPPERCASE\]/gu, "$<t>")
               .replaceAll(/\[LOWERCASE\](?<t>.*?)\[\/LOWERCASE\]/gu, "$<t>")
               .replaceAll(/\[CAPITALIZE\](?<t>.*?)\[\/CAPITALIZE\]/gu, "$<t>")
               .replaceAll("[CR]", " ")
               .trim();
};
