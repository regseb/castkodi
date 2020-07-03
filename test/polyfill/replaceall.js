import stringPrototypeReplaceAll from "string.prototype.replaceall";

/**
 * Remplace toutes les occurences du patron par le remplaçant.
 *
 * @this string
 * @param {string|RegExp}   pattern     La patron.
 * @param {string|Function} replacement Le remplaçant.
 */
export const replaceAll = function (pattern, replacement) {
    return stringPrototypeReplaceAll(this, pattern, replacement);
};
