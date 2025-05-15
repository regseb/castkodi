/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/noscript.js";

describe("core/scraper/noscript.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://foo.com/bar.zip");
            const metadata = { html: () => Promise.resolve(undefined) };
            const context = { depth: false, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't noscript", async function () {
            const url = new URL("https://foo.com/bar.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            '<html lang="en"><body></body></html>',
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when noscript is empty", async function () {
            const url = new URL("https://foo.com/bar.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <noscript></noscript>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return URL from video in noscript", async function () {
            const url = new URL("https://foo.com/bar.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <noscript>
                                 <video src="https://baz.org/qux.mp4" />
                               </noscript>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: true };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, "https://baz.org/qux.mp4");
        });

        it("should return URL from second noscript", async function () {
            const url = new URL("https://foo.com/bar.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <noscript>
                                 <a href="https://baz.org/">link</a>
                               </noscript>
                               <noscript>
                                 <audio src="https://qux.org/quux.mp3" />
                               </noscript>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, "https://qux.org/quux.mp3");
        });
    });
});
