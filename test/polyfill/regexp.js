/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * Échappe les caractères spéciaux d'une expression régulière.
 *
 * @param {string} text Le texte à échapper.
 * @returns {string} Le texte échappé.
 * @see https://developer.mozilla.org/Web/JavaScript/Reference/Global_Objects/RegExp/escape
 * @see https://github.com/nodejs/node/releases/tag/v24.0.0
 */
export const escape = (text) => {
    return text.replaceAll(/[$\(\)*+.?\[\\\]^\{\|\}]/gv, String.raw`\$&`);
};
