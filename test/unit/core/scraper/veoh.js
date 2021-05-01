import assert from "node:assert";
import sinon from "sinon";
import { extract } from "../../../../src/core/scraper/veoh.js";

describe("core/scraper/veoh.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://www.veoh.com/list-c/foo");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when page doesn't exist", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({ success: false }),
            ));

            const url = new URL("https://www.veoh.com/watch/foo");

            const file = await extract(url);
            assert.strictEqual(file, null);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.veoh.com/watch/getVideo/foo",
            ]);

            stub.restore();
        });

        it("should return null when there isn't video", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({ success: true, video: { src: { HQ: "" } } }),
            ));

            const url = new URL("https://www.veoh.com/watch/foo");

            const file = await extract(url);
            assert.strictEqual(file, null);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.veoh.com/watch/getVideo/foo",
            ]);

            stub.restore();
        });

        it("should return video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({
                    success: true,
                    video:   { src: { HQ: "https://foo.com/bar.mp4" } },
                }),
            ));

            const url = new URL("https://www.veoh.com/watch/foo");

            const file = await extract(url);
            assert.strictEqual(file, "https://foo.com/bar.mp4");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.veoh.com/watch/getVideo/foo",
            ]);

            stub.restore();
        });
    });
});
