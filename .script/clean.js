import fs from "node:fs/promises";

const paths = await fs.readFile(".gitignore");
paths.toString()
     .split("\n")
     .filter((p) => "" !== p)
     // Enlever la barre oblique commençant le chemin.
     .map((p) => p.slice(1))
     .forEach((p) => fs.rm(p, { force: true, recursive: true }));
