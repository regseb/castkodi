import assert from "node:assert";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/videopress.js";

describe("core/scraper/videopress.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://videopress.com/");

            const file = await scraper.extract(url);
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({ original: "https://bar.com/baz.avi" }),
            ));

            const url = new URL("https://videopress.com/v/foo");

            const file = await scraper.extract(url);
            assert.strictEqual(file, "https://bar.com/baz.avi");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://public-api.wordpress.com/rest/v1.1/videos/foo",
            ]);

            stub.restore();
        });

        it("should return video URL from embed", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({ original: "https://qux.com/quux.avi" }),
            ));

            const url = new URL("https://videopress.com/embed/foo?bar=baz");

            const file = await scraper.extract(url);
            assert.strictEqual(file, "https://qux.com/quux.avi");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://public-api.wordpress.com/rest/v1.1/videos/foo",
            ]);

            stub.restore();
        });

        it("should return null when video not found", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                "",
                { status: 404 },
            ));

            const url = new URL("https://videopress.com/v/foo");

            const file = await scraper.extract(url);
            assert.strictEqual(file, null);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://public-api.wordpress.com/rest/v1.1/videos/foo",
            ]);

            stub.restore();
        });
    });
});
