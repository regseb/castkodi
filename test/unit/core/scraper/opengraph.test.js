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
import * as scraper from "../../../../src/core/scraper/opengraph.js";
import "../../setup.js";

describe("core/scraper/opengraph.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("extractVideo()", () => {
        it("should return undefined when it isn't HTML", async () => {
            const url = new URL("https://foo.com");
            const metadata = { html: () => Promise.resolve(undefined) };
            const context = { depth: false, incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when content is empty", async () => {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><head>
                               <meta property="og:video:type"
                                     content="video/mp4" />
                               <meta property="og:video" content="" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return video URL when there isn't type", async () => {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><head>
                               <meta property="og:video"
                                     content="https://bar.com/baz.hls" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(file, "https://bar.com/baz.hls");
        });

        it("should return video URL", async () => {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><head>
                               <meta property="og:video:type"
                                     content="video/web" />
                               <meta property="og:video"
                                     content="https://bar.com/baz.mkv" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(file, "https://bar.com/baz.mkv");
        });

        it("should return undefined when type isn't supported", async () => {
            const fetch = mock.method(globalThis, "fetch");

            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><head>
                               <meta property="og:video:type"
                                     content="application/pdf" />
                               <meta property="og:video"
                                     content="https://bar.com/baz.pdf" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 0);
        });

        it("should return undefined when it's depther", async () => {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><head>
                               <meta property="og:video:type"
                                     content="text/html" />
                               <meta property="og:video"
                                     content="https://bar.com/baz.html" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: true, incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when sub-page doesn't have media", async () => {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><head>
                               <meta property="og:video:type"
                                     content="text/html" />
                               <meta property="og:video"
                                     content="https://bar.com/baz.html" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return plugin URL", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><head>
                               <meta property="og:video:type"
                                     content="text/html" />
                               <meta property="og:video"
                                     content="https://www.twitch.tv/foo" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: true };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });

    describe("extractAudio()", () => {
        it("should return undefined when it isn't HTML", async () => {
            const url = new URL("https://foo.com");
            const metadata = { html: () => Promise.resolve(undefined) };
            const context = { depth: false, incognito: false };

            const file = await scraper.extractAudio(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when content is empty", async () => {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><head>
                               <meta property="og:audio:type"
                                     content="audio/mpeg" />
                               <meta property="og:audio" content="" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extractAudio(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return audio URL when there isn't type", async () => {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><head>
                               <meta property="og:audio"
                                     content="https://bar.com/baz.mp3" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extractAudio(url, metadata, context);
            assert.equal(file, "https://bar.com/baz.mp3");
        });

        it("should return audio URL", async () => {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><head>
                               <meta property="og:audio:type"
                                     content="audio/x-wav" />
                               <meta property="og:audio:secure_url"
                                     content="https://bar.com/baz.wav" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extractAudio(url, metadata, context);
            assert.equal(file, "https://bar.com/baz.wav");
        });

        it("should return undefined when type isn't supported", async () => {
            const fetch = mock.method(globalThis, "fetch");

            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><head>
                               <meta property="og:audio:type"
                                     content="bar/baz" />
                               <meta property="og:audio"
                                     content="https://qux.com/" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extractAudio(url, metadata, context);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 0);
        });

        it("should return undefined when it's depther", async () => {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><head>
                               <meta property="og:audio:type"
                                     content="text/html" />
                               <meta property="og:audio"
                                     content="https://bar.com/baz.html" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: true, incognito: false };

            const file = await scraper.extractAudio(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when sub-page doesn't have media", async () => {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><head>
                               <meta property="og:audio:type"
                                     content="text/html" />
                               <meta property="og:audio"
                                     content="https://bar.com/baz.html" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extractAudio(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return plugin URL", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><head>
                               <meta property="og:audio:type"
                                     content="text/html" />
                               <meta
                                 property="og:audio"
                                 content="https://www.mixcloud.com/foo/bar/"
                               />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extractAudio(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.audio.mixcloud/?mode=40&key=%2Ffoo%2Fbar%2F",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, [
                "audio",
                "video",
            ]);
        });
    });

    describe("extractTwitter()", () => {
        it("should return undefined when it isn't HTML", async () => {
            const url = new URL("https://foo.com");
            const metadata = { html: () => Promise.resolve(undefined) };
            const context = { depth: false, incognito: false };

            const file = await scraper.extractTwitter(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't Open Graph", async () => {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            '<html lang="en"><head></head></html>',
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extractTwitter(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when it's depth", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons");

            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><head>
                               <meta
                                 property="twitter:player"
                                 content="https://www.youtube.com/embed/bar"
                               />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: true, incognito: false };

            const file = await scraper.extractTwitter(url, metadata, context);
            assert.equal(file, undefined);

            assert.equal(getAddons.mock.callCount(), 0);
        });

        it("should return undefined when sub-page doesn't have media", async () => {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><head>
                               <meta property="twitter:player"
                                     content="https://www.youtube.com/" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return video URL", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><head>
                               <meta
                                 property="twitter:player"
                                 content="https://www.youtube.com/embed/bar"
                               />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extractTwitter(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=bar&incognito=false",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });

    describe("extractTwitterStream()", () => {
        it("should return undefined when it isn't HTML", async () => {
            const url = new URL("https://foo.com");
            const metadata = { html: () => Promise.resolve(undefined) };

            const file = await scraper.extractTwitterStream(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't Open Graph", async () => {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            '<html lang="en"><head></head></html>',
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractTwitterStream(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return video URL", async () => {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><head>
                               <meta property="twitter:player:stream"
                                     content="https://bar.com/baz.avi" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractTwitterStream(url, metadata);
            assert.equal(file, "https://bar.com/baz.avi");
        });
    });

    describe("extractYandex()", () => {
        it("should return undefined when it isn't HTML", async () => {
            const url = new URL("https://foo.com");
            const metadata = { html: () => Promise.resolve(undefined) };

            const file = await scraper.extractYandex(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't Open Graph", async () => {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            '<html lang="en"><head></head></html>',
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractYandex(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return video URL", async () => {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><head>
                               <meta property="ya:ovs:content_url"
                                     content="https://bar.com/baz.avi" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractYandex(url, metadata);
            assert.equal(file, "https://bar.com/baz.avi");
        });
    });
});
