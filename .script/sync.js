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
        // Supprimer le fichier de destination s'il existe car la fonction
        // link() échoue si la destination existe déjà.
        // https://github.com/nodejs/node/issues/40521
        await fs.rm(dest, { force: true });
        await fs.link(src, dest);
    }
};

await copy("node_modules/webextension-polyfill/dist/browser-polyfill.js",
           "src/polyfill/lib/browser-polyfill.js");
