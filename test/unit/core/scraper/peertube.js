import assert from "node:assert";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/peertube.js";

describe("core/scraper/peertube.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://joinpeertube.org/fr/faq/");

            const file = await scraper.extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a video", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({}),
            ));

            const url = new URL("https://foo.com/videos/watch/bar");

            const file = await scraper.extract(url);
            assert.strictEqual(file, null);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://foo.com/api/v1/videos/bar",
            ]);

            stub.restore();
        });

        it("should return video URL from watch page", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({
                    files: [{ fileUrl: "http://baz.io/qux.avi" }],
                }),
            ));

            const url = new URL("https://foo.com/videos/watch/bar");

            const file = await scraper.extract(url);
            assert.strictEqual(file, "http://baz.io/qux.avi");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://foo.com/api/v1/videos/bar",
            ]);

            stub.restore();
        });

        it("should return video URL from embed page", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({
                    files: [{ fileUrl: "http://baz.fr/qux.avi" }],
                }),
            ));

            const url = new URL("https://foo.com/videos/embed/bar");

            const file = await scraper.extract(url);
            assert.strictEqual(file, "http://baz.fr/qux.avi");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://foo.com/api/v1/videos/bar",
            ]);

            stub.restore();
        });

        it("should return null when it's not a PeerTube website",
                                                             async function () {
            const stub = sinon.stub(globalThis, "fetch")
                              .rejects(new Error("baz"));

            const url = new URL("https://foo.com/videos/embed/bar");

            const file = await scraper.extract(url);
            assert.strictEqual(file, null);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://foo.com/api/v1/videos/bar",
            ]);

            stub.restore();
        });
    });
});
