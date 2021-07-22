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
                    videoJsonPlayer: { VSR: { 0: { id: "baz_2" } } },
                }),
            ));

            const url = new URL("https://www.arte.tv/de/videos/foo/bar");

            const file = await scraper.extract(url);
            assert.strictEqual(file, null);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://api.arte.tv/api/player/v1/config/de/foo",
            ]);

            stub.restore();
        });

        it("should return french video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({
                    videoJsonPlayer: {
                        VSR: {
                            0: { id: "baz_1", height: 100 },
                            1: { id: "baz_2" },
                            2: {
                                id:     "baz_1",
                                height: 400,
                                url:    "https://qux.tv/quux.mp4",
                            },
                            3: {
                                id:     "baz_1",
                                height: 200,
                            },
                        },
                    },
                }),
            ));

            const url = new URL("https://www.arte.tv/fr/videos/foo/bar");

            const file = await scraper.extract(url);
            assert.strictEqual(file, "https://qux.tv/quux.mp4");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://api.arte.tv/api/player/v1/config/fr/foo",
            ]);

            stub.restore();
        });
    });
});
