import assert      from "assert";
import sinon       from "sinon";
import { extract } from "../../../../src/core/scraper/videopress.js";

describe("core/scraper/videopress.js", function () {
    afterEach(function () {
        sinon.restore();
    });

    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://videopress.com/";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({
                ok:   true,
                json: () => ({ original: "https://bar.com/baz.avi" }),
            }));

            const url = "https://videopress.com/v/foo";
            const expected = "https://bar.com/baz.avi";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
            const call = globalThis.fetch.firstCall;
            assert.strictEqual(call.args[0],
                               "https://public-api.wordpress.com/rest/v1.1" +
                                                                 "/videos/foo");
        });

        it("should return video URL from embed", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({
                ok:   true,
                json: () => ({ original: "https://qux.com/quux.avi" }),
            }));

            const url = "https://videopress.com/embed/foo?bar=baz";
            const expected = "https://qux.com/quux.avi";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
            const call = globalThis.fetch.firstCall;
            assert.strictEqual(call.args[0],
                               "https://public-api.wordpress.com/rest/v1.1" +
                                                                 "/videos/foo");
        });

        it("should return null when video not found", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({ ok: false }));

            const url = "https://videopress.com/v/foo";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
            const call = globalThis.fetch.firstCall;
            assert.strictEqual(call.args[0],
                               "https://public-api.wordpress.com/rest/v1.1" +
                                                                 "/videos/foo");
        });
    });
});
