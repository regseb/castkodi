/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/embed.js";

describe("core/scraper/embed.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://foo.com/bar.zip");
            const content = { html: () => Promise.resolve(undefined) };
            const options = { depth: false, incognito: true };

            const file = await scraper.extract(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't embed", async function () {
            const url = new URL("https://foo.com/bar.html");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            "<html><body></body></html>",
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: false, incognito: true };

            const file = await scraper.extract(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return URL from video embed", async function () {
            const url = new URL("https://foo.com/bar.html");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <embed type="video/mp4"
                                      src="https://foo.com/baz.mp4" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: false, incognito: true };

            const file = await scraper.extract(url, content, options);
            assert.equal(file, "https://foo.com/baz.mp4");
        });

        it("should return URL from audio embed", async function () {
            const url = new URL("https://foo.com/bar.html");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <embed type="audio/mp3" src="baz.mp3" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: false, incognito: true };

            const file = await scraper.extract(url, content, options);
            assert.equal(file, "https://foo.com/baz.mp3");
        });

        it("should return URL from other page embed", async function () {
            const url = new URL("https://foo.com/bar.html");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <embed src="//player.vimeo.com/video/baz" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: false, incognito: true };

            const file = await scraper.extract(url, content, options);
            assert.equal(
                file,
                "plugin://plugin.video.vimeo/play/?video_id=baz",
            );
        });

        it("should return undefined when it's depth", async function () {
            const url = new URL("https://foo.com/bar.html");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <embed src="//player.vimeo.com/video/baz" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: true, incognito: true };

            const file = await scraper.extract(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return URL from second embed", async function () {
            const url = new URL("https://www.dailymotion.com/index.html");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <embed src="http://exemple.com/data.zip" />
                               <embed src="/embed/video/foo" />
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
                    "?mode=playVideo&url=foo",
            );
        });
    });
});
