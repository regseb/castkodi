/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/uqload.js";

describe("core/scraper/uqload.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://uqload.foo/faq");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when no html", async function () {
            const url = new URL("https://uqload.foo/bar.html");
            const metadata = { html: () => Promise.resolve(undefined) };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return undefined when no script", async function () {
            const url = new URL("https://uqload.foo/bar.html");
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

        it("should return undefined when no inline script", async function () {
            const url = new URL("https://uqload.foo/bar.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <script src="https://uqload.foo/baz.js"></script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return undefined when no sources", async function () {
            const url = new URL("https://uqload.foo/bar.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <script>
                                 var player = new Clappr.Player({});
                               </script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return video URL", async function () {
            const url = new URL("https://uqload.foo/bar.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <script>
                                 var player = new Clappr.Player({
                                   sources: ["https://baz.com/qux/v.mp4"],
                                 });
                               </script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(
                file,
                "https://baz.com/qux/v.mp4|Referer=https://uqload.foo/bar.html",
            );
        });
    });
});
