import assert from "node:assert";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/vidyard.js";

describe("core/scraper/vidyard.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://www.vidyard.com/video-hosting/");

            const file = await scraper.extract(url);
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({
                    payload: {
                        chapters: [{
                            sources: {
                                hls: [{ url: "http://foo.com/bar.hls" }],
                            },
                        }],
                    },
                }),
            ));

            const url = new URL("https://play.vidyard.com/baz?qux=1");

            const file = await scraper.extract(url);
            assert.strictEqual(file,
                "http://foo.com/bar.hls|Referer=https://play.vidyard.com/");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://play.vidyard.com/player/baz.json",
            ]);
        });

        it("should return video URL from pathname with extension",
                                                             async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({
                    payload: {
                        chapters: [{
                            sources: {
                                hls: [{ url: "http://foo.com/bar.hls" }],
                            },
                        }],
                    },
                }),
            ));

            const url = new URL("https://play.vidyard.com/baz.html?");

            const file = await scraper.extract(url);
            assert.strictEqual(file,
                "http://foo.com/bar.hls|Referer=https://play.vidyard.com/");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://play.vidyard.com/player/baz.json",
            ]);
        });
    });
});
