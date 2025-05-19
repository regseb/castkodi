/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";

/**
 * Liste des langues disponibles.
 *
 * @type {string[]}
 */
const LANGUAGES = await fs.readdir("src/_locales/");

/**
 * Récupère la liste des messages d'une langue.
 *
 * @param {string} lang La langue des messages.
 * @returns {Promise<Object[][]>} Une promesse contenant la liste des messages.
 */
const read = async (lang) => {
    return Object.entries(
        JSON.parse(
            await fs.readFile(`src/_locales/${lang}/messages.json`, "utf8"),
        ),
    );
};

/**
 * Compare deux listes des messages dans deux langues différentes.
 *
 * @param {string} lang1 La première langue des messages.
 * @param {string} lang2 La deuxième langue des messages.
 */
const compare = async (lang1, lang2) => {
    const messages1 = await read(lang1);
    const messages2 = await read(lang2);

    assert.equal(messages1.length, messages2.length);
    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; i < messages1.length; ++i) {
        const [name1, value1] = messages1[i];
        const [name2, value2] = messages2[i];
        assert.equal(name1, name2);

        assert.ok("message" in value1);
        assert.ok("message" in value2);
        assert.deepEqual(value1.placeholders, value2.placeholders);

        if ("placeholders" in value1) {
            for (const key of Object.keys(value1.placeholders)) {
                assert.ok(
                    value1.message.includes("$" + key.toUpperCase() + "$"),
                    `${name1} / ${key}`,
                );
                assert.ok(
                    value2.message.includes("$" + key.toUpperCase() + "$"),
                    `${name1} / ${key}`,
                );
            }
        }
    }
};

describe("_locales", function () {
    for (const lang of LANGUAGES) {
        it(`'en' and '${lang}' should have same messages`, async function () {
            await compare("en", lang);
        });
    }
});
