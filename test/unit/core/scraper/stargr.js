/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
import * as scraper from "../../../../src/core/scraper/stargr.js";

describe("core/scraper/stargr.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extractTv()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://disney.fr/disney-plus-star");

            const file = await scraper.extractTv(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async function () {
            const url = new URL("https://www.star.gr/tv/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            '<html lang="gr"><body><div></div></body></html>',
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractTv(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return video URL", async function () {
            const url = new URL("https://www.star.gr/tv/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="gr"><body>
                               <div data-plugin-bitmovinv5="${JSON.stringify({
                                   BitMovin: {
                                       ConfigUrl:
                                           "https://baz.gr/manifest.m3u8",
                                   },
                               }).replaceAll('"', "&quot;")}"></div>
                              </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractTv(url, metadata);
            assert.equal(file, "https://baz.gr/manifest.m3u8");
        });
    });

    describe("extractVideo()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://disney.fr/disney-plus-star");

            const file = await scraper.extractVideo(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async function () {
            const url = new URL("https://www.star.gr/video/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="gr"><body>
                               <iframe></iframe>
                               <script></script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when it's depth", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons");

            const url = new URL("https://www.star.gr/video/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="gr"><body>
                               <!-- Coller le "style" et la "src", car c'est le
                                    cas dans les pages de StarGR. -->
                               <iframe
                                 id="yt-player"
                                 style=""src="https://www.youtube.com/embed/bar"
                               ></iframe>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: true, incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(file, undefined);

            assert.equal(getAddons.mock.callCount(), 0);
        });

        it("should return undefined when sub-page doesn't have media", async function () {
            const url = new URL("https://www.star.gr/video/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="gr"><body>
                               <!-- Coller le "style" et la "src", car c'est le
                                    cas dans les pages de StarGR. -->
                               <iframe
                                 id="yt-player"
                                 style=""src="https://www.youtube.com/"
                               ></iframe>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return video YouTube id", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.star.gr/video/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="gr"><body>
                               <!-- Coller le "style" et la "src", car c'est le
                                    cas dans les pages de StarGR. -->
                               <iframe
                                 id="yt-player"
                                 style=""src="https://www.youtube.com/embed/bar"
                               ></iframe>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=bar&incognito=false",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });
});
