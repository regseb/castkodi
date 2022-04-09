import assert from "node:assert";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/radioline.js";

describe("core/scraper/radioline.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("http://twitter.com/RadiolineFrance");

            const file = await scraper.extract(url);
            assert.strictEqual(file, undefined);
        });

        it("should return undefined when it's not an audio", async function () {
            const url = new URL("https://fr-fr.radioline.co/foo");

            const file = await scraper.extract(url);
            assert.strictEqual(file, undefined);
        });

        it("should return undefined when it's not an audio with hash",
                                                             async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({ body: { type: "error" } }),
            ));

            const url = new URL("http://www.radioline.co/foo#bar-baz");

            const file = await scraper.extract(url);
            assert.strictEqual(file, undefined);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.radioline.co/Pillow/bar_baz/play",
            ]);
        });

        it("should return audio URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({
                    body: {
                        type:    "single",
                        content: {
                            streams: [{ url: "https://foo.com/bar.mp4" }],
                        },
                    },
                }),
            ));

            const url = new URL("http://www.radioline.co/baz#qux/quux");

            const file = await scraper.extract(url);
            assert.strictEqual(file, "https://foo.com/bar.mp4");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.radioline.co/Pillow/qux/quux/play",
            ]);
        });
    });
});
