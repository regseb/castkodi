import assert      from "assert";
import sinon       from "sinon";
import { extract } from "../../../../src/core/scraper/bigo.js";

describe("core/scraper/bigo.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://www.bigo.sg/");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a video", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({ data: [] }),
            ));

            const url = new URL("https://www.bigo.tv/foo");

            const file = await extract(url);
            assert.strictEqual(file, null);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.bigo.tv/studio/getInternalStudioInfo",
                { method: "POST", body: new URLSearchParams("siteId=foo") },
            ]);

            stub.restore();
        });

        it("should return video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                // eslint-disable-next-line camelcase
                JSON.stringify({ data: { hls_src: "http://bar.tv/baz.m3u8" } }),
            ));

            const url = new URL("http://www.bigo.tv/foo");

            const file = await extract(url);
            assert.strictEqual(file, "http://bar.tv/baz.m3u8");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.bigo.tv/studio/getInternalStudioInfo",
                { method: "POST", body: new URLSearchParams("siteId=foo") },
            ]);

            stub.restore();
        });
    });
});
