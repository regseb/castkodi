/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/melty.js";

describe("core/scraper/melty.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.melty.com/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it's depth", async function () {
            const url = new URL("https://www.melty.fr/foo");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><head>
                               <meta itemprop="contentUrl"
                                     content="http://www.dailymotion.com` +
                                `/embed/video/bar" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: true };

            const file = await scraper.extract(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't video", async function () {
            const url = new URL("https://www.melty.fr/foo");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><head>
                               <meta name="description" content="bar" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: false };

            const file = await scraper.extract(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return URL", async function () {
            const url = new URL("https://www.melty.fr/foo");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><head>
                               <meta itemprop="contentUrl"
                                     content="http://foo.com/bar.html" />
                               <meta itemprop="contentUrl"
                                     content="http://www.dailymotion.com` +
                                `/embed/video/bar" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: false };

            const file = await scraper.extract(url, content, options);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=bar",
            );
        });
    });
});
