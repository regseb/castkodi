/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
import "./setup.js";

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
const importMessages = async (lang) => {
    const module = await import(`../../src/_locales/${lang}/messages.json`, {
        with: { type: "json" },
    });
    return Object.entries(module.default);
};

describe("_locales", async () => {
    const englishMessages = await importMessages("en");

    for (const lang of LANGUAGES) {
        await it(`'en' and '${lang}' should have same messages`, async () => {
            const messages = await importMessages(lang);

            assert.equal(messages.length, englishMessages.length);
            // Récupérer les messages avec leur indice pour vérifier que l'ordre
            // est identique entre les deux langues.
            // eslint-disable-next-line unicorn/no-for-loop
            for (let i = 0; i < messages.length; ++i) {
                const [name, value] = messages[i];
                const [englishName, englishValue] = englishMessages[i];
                assert.equal(name, englishName);

                assert.ok("message" in value);
                assert.deepEqual(value.placeholders, englishValue.placeholders);

                if ("placeholders" in value) {
                    for (const key of Object.keys(value.placeholders)) {
                        assert.ok(
                            value.message.includes(`$${key.toUpperCase()}$`),
                            `${name} / ${key}`,
                        );
                    }
                }
            }
        });
    }
});
