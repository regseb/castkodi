import jsdom from "jsdom";

export const DOMParser = class {

    /**
     * Analyse un document HTML.
     *
     * @param {string} data La chaine de caractères contenant du HTML.
     * @returns {Document} Le document HTML.
     */
    parseFromString(data) {
        const virtualConsole = new jsdom.VirtualConsole();
        return new jsdom.JSDOM(data, { virtualConsole }).window.document;
    }
};
