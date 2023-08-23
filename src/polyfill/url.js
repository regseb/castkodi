/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

if (!("canParse" in URL)) {
    /**
     * Vérifie si une URL est valide.
     *
     * @param {string} url L'URL vérifiée.
     * @returns {boolean} <code>true</code> si l'URL est valide ; sinon
     *                    <code>false</code>.
     * @see https://crbug.com/1425839
     */
    URL.canParse = (url) => {
        try {
            // eslint-disable-next-line no-new
            new URL(url);
            return true;
        } catch {
            // Indiquer que la construction de l'URL a échouée.
            return false;
        }
    };
}
