import assert      from "assert";
import sinon       from "sinon";
import { extract } from "../../../../src/core/scraper/arte.js";

describe("core/scraper/arte.js", function () {
    afterEach(function () {
        sinon.restore();
    });

    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://www.arte.tv/fr/guide/";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when video is unavailable", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({
                json: () => ({
                    videoJsonPlayer: { VSR: { 0: { id: "baz_2" } } },
                }),
            }));

            const url = "https://www.arte.tv/de/videos/foo/bar";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
            const call = globalThis.fetch.firstCall;
            assert.strictEqual(call.args[0],
                               "https://api.arte.tv/api/player/v1/config/de" +
                               "/foo");
        });

        it("should return french video URL", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({
                json: () => ({
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
            }));

            const url = "https://www.arte.tv/fr/videos/foo/bar";
            const expected = "https://qux.tv/quux.mp4";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
            const call = globalThis.fetch.firstCall;
            assert.strictEqual(call.args[0],
                               "https://api.arte.tv/api/player/v1/config/fr" +
                               "/foo");
        });
    });
});
