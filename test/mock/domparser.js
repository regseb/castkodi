import { JSDOM } from "jsdom";

export const DOMParser = class {

    /**
     * Analyse un document HTML.
     *
     * @param {string} data La chaine de caractères contenant du HTML.
     * @return {Document} Le document HTML.
     */
    parseFromString(data) {
        return new JSDOM(data).window.document;
    }
};
