import assert from "assert";
import fs from "fs";

const compare = (messages1, messages2) => {
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
                    assert.fail(message + "." + key);
                }
                if (!("content" in placeholder)) {
                    assert.fail(message + "." + key);
                }
                if (!(key in messages2[name].placeholders)) {
                    assert.fail(message + "." + key);
                }
            }
        }
    }
};

describe("_locales", function () {
    it("should have same messages", function () {
        const fr = JSON.parse(fs.readFileSync("src/_locales/fr/messages.json",
                                              "utf8"));
        const en = JSON.parse(fs.readFileSync("src/_locales/en/messages.json",
                                              "utf8"));

        compare(fr, en);
        compare(en, fr);
    });
});
