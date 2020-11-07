import fs from "fs";

fs.rmdirSync("build/",        { recursive: true });
fs.rmdirSync("coverage/",     { recursive: true });
fs.rmdirSync("jsdocs/",       { recursive: true });
fs.rmdirSync("node_modules/", { recursive: true });
