/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
import * as scraper from "../../../../src/core/scraper/theguardian.js";

describe("core/scraper/theguardian.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extractVideo()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL(
                "https://support.theguardian.com/eu/contribute",
            );
            const metadata = undefined;
            const context = { depth: false, incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when it's depth", async function () {
            const url = new URL("https://www.theguardian.com/foo");
            const metadata = undefined;
            const context = { depth: true, incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async function () {
            const url = new URL("https://www.theguardian.com/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            '<html lang="en"><body></body></html>',
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return video URL", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.theguardian.com/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <div data-component="youtube-atom"
                                    data-video-id="bar" />
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

        it("should return video URL in incognito mode", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.theguardian.com/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <div data-component="youtube-atom"
                                    data-video-id="bar" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: true };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=bar&incognito=true",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });

    describe("extractAudio()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL(
                "https://support.theguardian.com/eu/contribute",
            );
            const metadata = undefined;
            const context = { depth: false, incognito: false };

            const file = await scraper.extractAudio(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't an audio", async function () {
            const url = new URL("https://www.theguardian.com/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            '<html lang="en"><body></body></html>',
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extractAudio(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return audio URL", async function () {
            const url = new URL("https://www.theguardian.com/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <figure id="audio-component-container"
                                       data-source="https://bar.com/baz.mp3" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extractAudio(url, metadata, context);
            assert.equal(file, "https://bar.com/baz.mp3");
        });
    });
});
