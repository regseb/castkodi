/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @import { Configuration } from "markdownlint"
 */

/**
 * @type {Configuration}
 */
export default {
    // Ne pas vérifier la longueur des lignes du CHANGELOG, car celui-ci est
    // généré par release-please et il peut avoir de longues lignes.
    "line-length": false,
};
