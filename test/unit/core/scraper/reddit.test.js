/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
// Importer le fichier des scrapers en premier pour contourner un problème de
// dépendances circulaires.
// eslint-disable-next-line import/no-unassigned-import
import "../../../../src/core/scrapers.js";
import * as scraper from "../../../../src/core/scraper/reddit.js";
import "../../setup.js";

describe("core/scraper/reddit.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("extract()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://www.redditinc.com/policies/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async () => {
            const url = new URL("https://www.reddit.com/r/foo");
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

        it("should return video URL", async () => {
            const url = new URL("https://www.reddit.com/r/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <shreddit-player src="https://bar.com/baz.mp4" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://bar.com/baz.mp4");
        });
    });

    describe("extractEmbed()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://www.redditinc.com/policies/");

            const file = await scraper.extractEmbed(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async () => {
            const url = new URL("https://www.reddit.com/r/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            '<html lang="en"><body></body></html>',
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractEmbed(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return video URL", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.reddit.com/r/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <shreddit-embed
                                 html="&lt;iframe
                                   src=&quot;https://www.dailymotion.com/embed/video/bar&quot;&gt;&lt;/iframe&gt;"
                               />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: true };

            const file = await scraper.extractEmbed(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=bar",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video URL from second embed", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.reddit.com/r/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <shreddit-embed
                                 html="&lt;span&gt;bar&lt;/span&gt;"
                               />
                               <shreddit-embed
                                 html="&lt;iframe
                                   src=&quot;https://www.dailymotion.com/embed/video/baz&quot;&gt;&lt;/iframe&gt;"
                               />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extractEmbed(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=baz",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });

    describe("extractOld()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://www.redditinc.com/policies/");
            const file = await scraper.extractOld(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video on old.reddit", async () => {
            const url = new URL("https://old.reddit.com/r/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            '<html lang="en"><body></body></html>',
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractOld(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return video URL from old.reddit.com", async () => {
            const url = new URL("https://old.reddit.com/r/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <div
                                 data-hls-url="https://old.reddit.com/video.m3u8"
                               ></div>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractOld(url, metadata);
            assert.equal(file, "https://old.reddit.com/video.m3u8");
        });
    });
});
