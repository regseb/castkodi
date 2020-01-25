import assert          from "assert";
import sinon           from "sinon";
import { PebkacError } from "../../../src/core/pebkac.js";

describe("core/pebkac.js", function () {
    describe("constructor()", function () {
        afterEach(function () {
            sinon.restore();
        });

        it("should accept one parameter", function () {
            sinon.stub(browser.i18n, "getMessage")
                 .callsFake((k, s) => (undefined === s
                                                    ? k
                                                    : k + ": " + s.toString()));

            const err = new PebkacError("clef");
            assert.strictEqual(err.message, "notifications_clef_message: ");
            assert.strictEqual(err.name, "PebkacError");
            assert.strictEqual(err.type, "clef");
            assert.strictEqual(err.title, "notifications_clef_title");
        });

        it("should accept two parameters", function () {
            sinon.stub(browser.i18n, "getMessage")
                 .callsFake((k, s) => (undefined === s ? k
                                                       : k + ": " + s));

            const err = new PebkacError("clef", "Substitution");
            assert.strictEqual(err.message,
                               "notifications_clef_message: Substitution");
            assert.strictEqual(err.name, "PebkacError");
            assert.strictEqual(err.type, "clef");
            assert.strictEqual(err.title, "notifications_clef_title");
        });

        it("should accept two parameters (even an array)", function () {
            sinon.stub(browser.i18n, "getMessage")
                 .callsFake((k, s) => (undefined === s
                                                    ? k
                                                    : k + ": " + s.toString()));

            const err = new PebkacError("clef", ["1ère substitution",
                                                 "2ème substitution"]);
            assert.strictEqual(err.message,
                              "notifications_clef_message: 1ère substitution," +
                                                          "2ème substitution");
            assert.strictEqual(err.name, "PebkacError");
            assert.strictEqual(err.type, "clef");
            assert.strictEqual(err.title, "notifications_clef_title");
        });
    });
});
