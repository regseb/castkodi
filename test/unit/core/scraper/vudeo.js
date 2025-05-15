/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/vudeo.js";

describe("core/scraper/vudeo.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://vudeo.foo/faq");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when no html", async function () {
            const url = new URL("https://vudeo.foo/bar.html");
            const metadata = { html: () => Promise.resolve(undefined) };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return undefined when no script", async function () {
            const url = new URL("https://vudeo.foo/bar.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            '<html lang="en"><body></body></html>',
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return undefined when no inline script", async function () {
            const url = new URL("https://vudeo.foo/bar.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <script src="https://vudeo.foo/baz.js"></script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return undefined when no sources", async function () {
            const url = new URL("https://vudeo.foo/bar.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
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
            const url = new URL("https://vudeo.foo/bar.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
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
                "https://baz.com/qux/v.mp4|Referer=https://vudeo.foo/bar.html",
            );
        });
    });
});
