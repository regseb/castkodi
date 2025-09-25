/**
 * @license MIT
 * @see https://prettier.io/docs/options
 * @see https://github.com/prettier/plugin-xml#configuration
 * @author Sébastien Règne
 */

import pluginXML from "@prettier/plugin-xml";

/**
 * @import { Config } from "prettier"
 */

/**
 * @type {Config}
 */
export default {
    plugins: [pluginXML],

    proseWrap: "always",

    // Options spécifiques du plugin XML.
    xmlQuoteAttributes: "double",
};
