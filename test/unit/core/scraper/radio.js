/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/radio.js";

describe("core/scraper/radio.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.radio.net/top-stations");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when no station", async function () {
            const url = new URL("https://www.radio.net/s/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <script>const bar = [1,"baz"];</script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return audio URL", async function () {
            const url = new URL("https://www.radio.net/s/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <script></script>
                               <script>
                                 const bar = "[1,\\"streams\\":[{\\"url\\":\\"https://baz.net/qux.aac\\",2]";
                               </script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://baz.net/qux.aac");
        });
    });
});
