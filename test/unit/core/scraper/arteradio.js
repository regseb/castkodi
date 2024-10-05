/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/arteradio.js";

describe("core/scraper/arteradio.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.arteradio.com/content/au_hasard");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return audio URL", async function () {
            const url = new URL("https://www.arteradio.com/son/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <article class="cover">
                                 <button data-sound-href="bar.mp3"></button>
                               </article>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(
                file,
                "https://cdn.arteradio.com/permanent/arteradio/sites/default" +
                    "/files/sons/bar.mp3",
            );
        });
    });
});
