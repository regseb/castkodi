"use strict";

const assert = require("assert");

const compare = function (messages1, messages2) {
    for (const name in messages1) {
        const message = messages1[name];
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
            for (const placeholder in message.placeholders) {
                if (!("content" in message.placeholders[placeholder])) {
                    assert.fail(message + "." + placeholder);
                }
                if (!(placeholder in messages2[name].placeholders)) {
                    assert.fail(message + "." + placeholder);
                }
            }
        }
    }
}; // compare()

describe("_locales", function () {

    it("should have same messages", function () {
        const fr = require("../src/_locales/fr/messages.json");
        const en = require("../src/_locales/en/messages.json");
        compare(fr, en);
        compare(en, fr);
    });
});
