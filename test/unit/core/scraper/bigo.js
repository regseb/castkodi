import assert from "node:assert";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/bigo.js";

describe("core/scraper/bigo.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("https://www.bigo.sg/");

            const file = await scraper.extract(url);
            assert.strictEqual(file, undefined);
        });

        it("should return undefined when it's not an id", async function () {
            const url = new URL("https://www.bigo.tv/foo");

            const file = await scraper.extract(url);
            assert.strictEqual(file, undefined);
        });

        it("should return undefined when pathname is invalid",
                                                             async function () {
            const url = new URL("https://www.bigo.tv/foo/123");

            const file = await scraper.extract(url);
            assert.strictEqual(file, undefined);
        });

        it("should return undefined when id is invalid", async function () {
            const url = new URL("https://www.bigo.tv/123foo");

            const file = await scraper.extract(url);
            assert.strictEqual(file, undefined);
        });

        it("should return undefined when it's not a video", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({ data: [] }),
            ));

            const url = new URL("https://www.bigo.tv/123");

            const file = await scraper.extract(url);
            assert.strictEqual(file, undefined);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.bigo.tv/studio/getInternalStudioInfo",
                { method: "POST", body: new URLSearchParams("siteId=123") },
            ]);
        });

        it("should return video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                // eslint-disable-next-line camelcase
                JSON.stringify({ data: { hls_src: "http://foo.tv/bar.m3u8" } }),
            ));

            const url = new URL("http://www.bigo.tv/123");

            const file = await scraper.extract(url);
            assert.strictEqual(file, "http://foo.tv/bar.m3u8");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.bigo.tv/studio/getInternalStudioInfo",
                { method: "POST", body: new URLSearchParams("siteId=123") },
            ]);
        });

        it("should return video URL from other language", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                // eslint-disable-next-line camelcase
                JSON.stringify({ data: { hls_src: "http://foo.tv/bar.m3u8" } }),
            ));

            const url = new URL("http://www.bigo.tv/ab/123");

            const file = await scraper.extract(url);
            assert.strictEqual(file, "http://foo.tv/bar.m3u8");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.bigo.tv/studio/getInternalStudioInfo",
                { method: "POST", body: new URLSearchParams("siteId=123") },
            ]);
        });
    });
});
