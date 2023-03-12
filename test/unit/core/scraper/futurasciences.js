/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/futurasciences.js";

describe("core/scraper/futurasciences.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://cdn.futura-sciences.com/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it's depth", async function () {
            const url = new URL("https://www.futura-sciences.com/foo");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <iframe data-src="//dai.ly/bar"></iframe>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: true, incognito: false };

            const file = await scraper.extract(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't HTML", async function () {
            const url = new URL("https://www.futura-sciences.com/favicon.png");
            const content = { html: () => Promise.resolve(undefined) };
            const options = { depth: false };

            const file = await scraper.extract(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't iframe", async function () {
            const url = new URL("https://www.futura-sciences.com/foo");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            "<html><body></body></html>",
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: false };

            const file = await scraper.extract(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return URL from iframe", async function () {
            const url = new URL("https://www.futura-sciences.com/foo");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <iframe data-src="//dai.ly/bar"></iframe>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: false, incognito: true };

            const file = await scraper.extract(url, content, options);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=bar",
            );
        });

        it("should return URL from iframe with data-src", async function () {
            const url = new URL("https://www.futura-sciences.com/foo");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `
                    <html><body>
                      <iframe src="//dai.ly/bar"></iframe>
                      <iframe data-src="http://baz.com/qux.zip"></iframe>
                      <iframe data-src="//dai.ly/quux"></iframe>
                    </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: false, incognito: false };

            const file = await scraper.extract(url, content, options);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/" +
                    "?mode=playVideo&url=quux",
            );
        });

        it("should return URL from vsly-player", async function () {
            const url = new URL("https://www.futura-sciences.com/foo");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <div class="vsly-player"
                                    data-iframe="//dai.ly/bar"></div>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: false, incognito: true };

            const file = await scraper.extract(url, content, options);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=bar",
            );
        });
    });
});
