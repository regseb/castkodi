import assert from "node:assert/strict";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/veoh.js";

describe("core/scraper/veoh.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("https://www.veoh.com/list-c/foo");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't video", async function () {
            const stub = sinon.stub(globalThis, "fetch").callsFake(() => {
                const response = new Response();
                Object.defineProperty(response, "url", {
                    value:        "https://www.veoh.com/exception",
                    configurable: true,
                });
                return Promise.resolve(response);
            });

            const url = new URL("https://www.veoh.com/watch/foo");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://www.veoh.com/watch/getVideo/foo",
            ]);
        });

        it("should return undefined when page doesn't exist",
                                                             async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({}),
            ));

            const url = new URL("https://www.veoh.com/watch/foo");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://www.veoh.com/watch/getVideo/foo",
            ]);
        });

        it("should return video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({
                    video: { src: { HQ: "https://foo.com/bar.mp4" } },
                }),
            ));

            const url = new URL("https://www.veoh.com/watch/baz");

            const file = await scraper.extract(url);
            assert.equal(file, "https://foo.com/bar.mp4");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://www.veoh.com/watch/getVideo/baz",
            ]);
        });
    });
});
