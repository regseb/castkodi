/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as scraper from "../../../../src/core/scraper/ultimedia.js";
import "../../setup.js";

describe("core/scraper/ultimedia.js", () => {
    describe("extract()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL(
                "https://www.ultimedia.com/default/presentation/cgu",
            );

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when no script", async () => {
            const url = new URL(
                "https://www.ultimedia.com/deliver/generic/iframe/foo",
            );
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

        it("should return undefined when no inline script", async () => {
            const url = new URL(
                "https://www.ultimedia.com/deliver/generic/iframe/foo",
            );
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <script
                                 src="https://www.ultimedia.com/script.js"
                               ></script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return undefined when no station", async () => {
            const url = new URL(
                "https://www.ultimedia.com/deliver/generic/iframe/foo",
            );
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <script>
                                 DtkPlayer.init({});
                               </script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return video URL", async () => {
            const url = new URL(
                "https://www.ultimedia.com/deliver/generic/iframe/foo",
            );
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <script>
                                 DtkPlayer.init({
                                   "mp4":{
                                     "mp4_1080":"https://bar.com/baz_1080.mp4",
                                     "mp4_720":"https://bar.com/baz_720.mp4"
                                   }
                                 });
                               </script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://bar.com/baz_1080.mp4");
        });
    });
});
