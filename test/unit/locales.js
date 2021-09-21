import assert from "node:assert";
import fs from "node:fs/promises";

/**
 * Compare deux lots de messages dans deux langues différentes.
 *
 * @param {Object} messages1 Les messages dans une langue.
 * @param {Object} messages2 Les messages dans une autre langue.
 */
const compare = function (messages1, messages2) {
    for (const [name, message] of Object.entries(messages1)) {
        if (!("message" in message)) {
            assert.fail(name);
        }
        if (!(name in messages2)) {
            assert.fail(name);
        }
        if ("placeholders" in message) {
            if (!("placeholders" in messages2[name])) {
                assert.fail(name);
            }
            for (const [key, placeholder] of
                                         Object.entries(message.placeholders)) {
                if (!message.message.includes("$" + key.toUpperCase() + "$")) {
                    assert.fail(`${message}.${key}`);
                }
                if (!("content" in placeholder)) {
                    assert.fail(`${message}.${key}`);
                }
                if (!(key in messages2[name].placeholders)) {
                    assert.fail(`${message}.${key}`);
                }
            }
        }
    }
};

describe("_locales", function () {
    it("should have same messages", async function () {
        const fr = JSON.parse(await fs.readFile("src/_locales/fr/messages.json",
                                                "utf8"));
        const en = JSON.parse(await fs.readFile("src/_locales/en/messages.json",
                                                "utf8"));
        const sk = JSON.parse(await fs.readFile("src/_locales/sk/messages.json",
                                                "utf8"));

        compare(fr, en);
        compare(en, fr);
        compare(sk, en);
        compare(en, sk);
    });
});
