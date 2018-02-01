"use strict";

const assert = require("assert");

const compare = function (messages1, messages2) {
    for (const [name, message] of Object.entries(messages1)) {
        if (!("message" in message)) {
            assert.fail(name);
        }
        if (!(name in messages2)) {
            assert.fail(name);
        }
        if ("placeholders" in message) {
            if (!("placeholders" in message)) {
                assert.fail(name);
            }
            for (const [key, placeholder] of
                                         Object.entries(message.placeholders)) {
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
        const fr = require("../src/_locales/fr/messages.json");
        const en = require("../src/_locales/en/messages.json");
        compare(fr, en);
        compare(en, fr);
    });
});
