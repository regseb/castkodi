/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import * as scraper from "../../../../src/core/scraper/arteradio.js";

describe("core/scraper/arteradio.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.arteradio.com/catalogue");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return audio URL", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({
                        pageProps: {
                            sound: {
                                mp3HifiMedia: {
                                    finalUrl: "https://foo.com/bar.mp3",
                                },
                            },
                        },
                    }),
                ),
            );

            const url = new URL("https://www.arteradio.com/son/baz");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="fr"><body>
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

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://www.arteradio.com/_next/data/qux/son/baz.json",
            ]);
        });
    });
});
