/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/arteradio.js";

describe("core/scraper/arteradio.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.arteradio.com/catalogue");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return audio URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                Response.json({
                    pageProps: {
                        sound: {
                            mp3HifiMedia: {
                                finalUrl: "https://foo.com/bar.mp3",
                            },
                        },
                    },
                }),
            );

            const url = new URL("https://www.arteradio.com/son/baz");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <script id="__NEXT_DATA__">${JSON.stringify({
                                   buildId: "qux",
                               })}</script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://foo.com/bar.mp3");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://www.arteradio.com/_next/data/qux/son/baz.json",
            ]);
        });
    });
});
