import assert      from "assert";
import sinon       from "sinon";
import { extract } from "../../../../src/core/scraper/peertube.js";

describe("core/scraper/peertube.js", function () {
    afterEach(function () {
        sinon.restore();
    });

    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://joinpeertube.org/fr/faq/";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not a video", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({ json: () => ({}) }));

            const url = "https://foo.com/videos/watch/bar";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
            const call = globalThis.fetch.firstCall;
            assert.strictEqual(call.args[0],
                               "https://foo.com/api/v1/videos/bar");
        });

        it("should return video URL from watch page", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({
                json: () => ({ files: [{ fileUrl: "http://baz.io/qux.avi" }] }),
            }));

            const url = "https://foo.com/videos/watch/bar";
            const expected = "http://baz.io/qux.avi";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
            const call = globalThis.fetch.firstCall;
            assert.strictEqual(call.args[0],
                               "https://foo.com/api/v1/videos/bar");
        });

        it("should return video URL from embed page", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({
                json: () => ({ files: [{ fileUrl: "http://baz.fr/qux.avi" }] }),
            }));

            const url = "https://foo.com/videos/embed/bar";
            const expected = "http://baz.fr/qux.avi";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
            const call = globalThis.fetch.firstCall;
            assert.strictEqual(call.args[0],
                               "https://foo.com/api/v1/videos/bar");
        });

        it("should return null when it's not a PeerTube website",
                                                             async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.reject(new Error()));

            const url = "https://foo.com/videos/embed/bar";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
            const call = globalThis.fetch.firstCall;
            assert.strictEqual(call.args[0],
                               "https://foo.com/api/v1/videos/bar");
        });
    });
});
