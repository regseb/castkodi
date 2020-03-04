import assert      from "assert";
import sinon       from "sinon";
import { extract } from "../../../../src/core/scraper/veoh.js";

describe("core/scraper/veoh.js", function () {
    afterEach(function () {
        sinon.restore();
    });

    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://www.veoh.com/list-c/foo";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when page doesn't exist", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({
                json: () => ({ success: false }),
            }));

            const url = "https://www.veoh.com/watch/foo";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
            const call = globalThis.fetch.firstCall;
            assert.strictEqual(call.args[0],
                               "https://www.veoh.com/watch/getVideo/foo");
        });

        it("should return null when there isn't video", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({
                json: () => ({
                    success: true,
                    video:   { src: { HQ: "" } },
                }),
            }));

            const url = "https://www.veoh.com/watch/foo";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
            const call = globalThis.fetch.firstCall;
            assert.strictEqual(call.args[0],
                               "https://www.veoh.com/watch/getVideo/foo");
        });

        it("should return video URL", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({
                json: () => ({
                    success: true,
                    video:   { src: { HQ: "https://foo.com/bar.mp4" } },
                }),
            }));

            const url = "https://www.veoh.com/watch/foo";
            const expected = "https://foo.com/bar.mp4";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
            const call = globalThis.fetch.firstCall;
            assert.strictEqual(call.args[0],
                               "https://www.veoh.com/watch/getVideo/foo");
        });
    });
});
