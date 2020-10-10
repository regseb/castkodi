import fs   from "fs";
import path from "path";

// Copier certains fichiers des bibliothèques externes.
const LIBS = [
    {
        src:  "dialog-polyfill/dist/dialog-polyfill.css",
        dest: "dialog-polyfill/style.css",
    }, {
        src:  "dialog-polyfill/dist/dialog-polyfill.esm.js",
        dest: "dialog-polyfill/script.js",
    },
];
for (const lib of LIBS) {
    fs.createReadStream(path.join("node_modules/", lib.src))
        .pipe(fs.createWriteStream(path.join("src/lib/", lib.dest)));
}
