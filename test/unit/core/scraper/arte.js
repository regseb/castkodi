import assert from "node:assert";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/arte.js";

describe("core/scraper/arte.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://www.arte.tv/fr/guide/");

            const file = await scraper.extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when video is unavailable", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({
                    videoJsonPlayer: { VSR: { 0: { id: "foo_2" } } },
                }),
            ));

            const url = new URL("https://www.arte.tv/de/videos/bar/baz");

            const file = await scraper.extract(url);
            assert.strictEqual(file, null);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://api.arte.tv/api/player/v1/config/de/bar",
            ]);
        });

        it("should return french video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({
                    videoJsonPlayer: {
                        VSR: {
                            0: { id: "foo_1", height: 100 },
                            1: { id: "foo_2" },
                            2: {
                                id:     "foo_1",
                                height: 400,
                                url:    "https://bar.tv/baz.mp4",
                            },
                            3: {
                                id:     "foo_1",
                                height: 200,
                            },
                        },
                    },
                }),
            ));

            const url = new URL("https://www.arte.tv/fr/videos/qux/quux");

            const file = await scraper.extract(url);
            assert.strictEqual(file, "https://bar.tv/baz.mp4");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://api.arte.tv/api/player/v1/config/fr/qux",
            ]);
        });
    });
});
