/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as scraper from "../../../../src/core/scraper/applepodcasts.js";
import "../../setup.js";

describe("core/scraper/applepodcasts.js", () => {
    describe("extract()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL(
                "https://podcasts.apple.com/us/artist/arte-radio/foo",
            );

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't data", async () => {
            const url = new URL("https://podcasts.apple.com/us/podcast/foo/id");
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

        it("should return undefined when it isn't an audio", async () => {
            const url = new URL("https://podcasts.apple.com/us/podcast/foo/id");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <script id="serialized-server-data">${JSON.stringify(
                                   [
                                       {
                                           data: {
                                               shelves: [
                                                   {
                                                       items: [
                                                           {
                                                               contextAction:
                                                                   {},
                                                           },
                                                       ],
                                                   },
                                               ],
                                           },
                                       },
                                   ],
                               )}</script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return audio URL", async () => {
            const url = new URL(
                "https://podcasts.apple.com/fr/podcast/foo/idbar",
            );
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <script id="serialized-server-data">${JSON.stringify(
                                   [
                                       {
                                           data: {
                                               shelves: [
                                                   {
                                                       items: [
                                                           {
                                                               contextAction: {
                                                                   episodeOffer:
                                                                       {
                                                                           streamUrl:
                                                                               "https://baz.fr/qux.mp3",
                                                                       },
                                                               },
                                                           },
                                                       ],
                                                   },
                                               ],
                                           },
                                       },
                                   ],
                               )}</script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://baz.fr/qux.mp3");
        });
    });
});
