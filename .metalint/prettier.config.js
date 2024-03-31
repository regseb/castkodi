/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import pluginXML from "@prettier/plugin-xml";

/**
 * @type {import("prettier").Config}
 */
export default {
    plugins: [pluginXML],

    // Options spécifiques du plugin XML.
    xmlQuoteAttributes: "double",
};
