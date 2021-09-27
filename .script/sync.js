import fs from "node:fs/promises";
import path from "node:path";

const copy = async function (src, dest) {
    await fs.mkdir(path.dirname(dest), { recursive: true });
    const stats = await fs.lstat(src);
    if (stats.isDirectory()) {
        await fs.mkdir(dest, { recursive: true });

        for (const filename of await fs.readdir(src)) {
            await copy(path.join(src, filename), path.join(dest, filename));
        }
    } else {
        try {
            // Supprimer le fichier de destination s'il existe.
            await fs.access(dest);
            await fs.rm(dest);
        } catch {
            // Ne rien faire si le fichier de destination n'existe pas.
        }
        await fs.link(src, dest);
    }
};

await copy("node_modules/dialog-polyfill/dist/dialog-polyfill.css",
           "src/polyfill/lib/dialog-polyfill.css");
await copy("node_modules/dialog-polyfill/dist/dialog-polyfill.esm.js",
           "src/polyfill/lib/dialog-polyfill-esm.js");

await copy("node_modules/webextension-polyfill/dist/browser-polyfill.js",
           "src/polyfill/lib/browser-polyfill.js");
