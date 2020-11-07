import { promises as fs } from "fs";
import path               from "path";

const copy = async function (src, dest) {
    await fs.mkdir(path.dirname(dest), { recursive: true });
    const stats = await fs.lstat(src);
    if (stats.isDirectory()) {
        await fs.mkdir(dest, { recursive: true });

        for await (const filename of fs.readdir(src)) {
            copy(path.join(src, filename), path.join(dest, filename));
        }
    } else {
        fs.copyFile(src, dest);
    }
};

copy("node_modules/dialog-polyfill/dist/dialog-polyfill.css",
     "src/polyfill/lib/dialog-polyfill/style.css");
copy("node_modules/dialog-polyfill/dist/dialog-polyfill.esm.js",
     "src/polyfill/lib/dialog-polyfill/script.js");
