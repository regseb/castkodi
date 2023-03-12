/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/blogtalkradio.js";

describe("core/scraper/blogtalkradio.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://help.blogtalkradio.com/en/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't an audio", async function () {
            const url = new URL("https://www.blogtalkradio.com/foo");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            "<html><head></head></html>",
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, content);
            assert.equal(file, undefined);
        });

        it("should return audio URL", async function () {
            const url = new URL("https://www.blogtalkradio.com/foo");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><head>
                               <meta property="twitter:player:stream"
                                     content="https://bar.com/baz.mp3" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, content);
            assert.equal(file, "https://bar.com/baz.mp3");
        });
    });
});
