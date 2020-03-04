import assert      from "assert";
import sinon       from "sinon";
import { extract } from "../../../../src/core/scraper/radioline.js";

describe("core/scraper/radioline.js", function () {
    afterEach(function () {
        sinon.restore();
    });

    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "http://twitter.com/RadiolineFrance";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not an audio", async function () {
            const url = "https://fr-fr.radioline.co/foo";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not an audio with hash",
                                                             async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({
                json: () => ({ body: { type: "error" } }),
            }));

            const url = "http://www.radioline.co/foo#bar-baz";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
            const call = globalThis.fetch.firstCall;
            assert.strictEqual(call.args[0],
                               "https://www.radioline.co/Pillow/bar_baz/play");
        });

        it("should return audio URL", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({
                json: () => ({
                    body: {
                        type:    "single",
                        content: {
                            streams: [{ url: "https://qux.com/quux.mp4" }],
                        },
                    },
                }),
            }));

            const url = "http://www.radioline.co/foo#bar/baz";
            const expected = "https://qux.com/quux.mp4";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
            const call = globalThis.fetch.firstCall;
            assert.strictEqual(call.args[0],
                               "https://www.radioline.co/Pillow/bar/baz/play");
        });
    });
});
