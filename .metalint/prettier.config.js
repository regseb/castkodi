/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import pluginXML from "@prettier/plugin-xml";

export default {
    // Enlever cette option lors de passage à Prettier 3.
    // https://github.com/prettier/prettier/issues/13142
    trailingComma: "all",
    // Ajouter manuellement les plugins car la découverte automatique des
    // plugins ne fonctionne pas avec pnpm.
    // https://github.com/pnpm/pnpm/issues/4700
    // https://github.com/prettier/prettier/issues/8474
    plugins: [pluginXML],
};
