/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/primevideo.js";

describe("core/scraper/primevideo.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.primevideo.com/storefront/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async function () {
            const url = new URL("https://www.primevideo.com/detail/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            "<html><body></body></html>",
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return video id", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .resolves(
                    new Response(
                        "<html><head><title>Prime Video: Foo</title></head></html>",
                    ),
                );

            const url = new URL("https://www.primevideo.com/detail/bar");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <div id="dv-action-box">
                                 <form>
                                   <input name="titleId" value="baz" />
                                 </form>
                               </div>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(
                file,
                "plugin://plugin.video.amazon-test/" +
                    "?mode=PlayVideo&asin=baz&name=Foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://www.primevideo.com/detail/baz",
            ]);
        });
    });
});
