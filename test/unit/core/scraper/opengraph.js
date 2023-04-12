/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/opengraph.js";

describe("core/scraper/opengraph.js", function () {
    describe("extractVideo()", function () {
        it("should return undefined when it isn't HTML", async function () {
            const url = new URL("https://foo.com");
            const content = { html: () => Promise.resolve(undefined) };
            const options = { depth: false };

            const file = await scraper.extractVideo(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return undefined when content is empty", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><head>
                               <meta property="og:video:type"
                                     content="video/mp4" />
                               <meta property="og:video" content="" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: false };

            const file = await scraper.extractVideo(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return video URL when there isn't type", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><head>
                               <meta property="og:video"
                                     content="https://bar.com/baz.hls" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: false };

            const file = await scraper.extractVideo(url, content, options);
            assert.equal(file, "https://bar.com/baz.hls");
        });

        it("should return video URL", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><head>
                               <meta property="og:video:type"
                                     content="video/web" />
                               <meta property="og:video"
                                     content="http://bar.com/baz.mkv" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: false };

            const file = await scraper.extractVideo(url, content, options);
            assert.equal(file, "http://bar.com/baz.mkv");
        });

        it("should return undefined when type isn't supported", async function () {
            const spy = sinon.stub(globalThis, "fetch");

            const url = new URL("https://foo.com");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><head>
                               <meta property="og:video:type"
                                     content="application/pdf" />
                               <meta property="og:video"
                                     content="http://bar.com/baz.pdf" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: false };

            const file = await scraper.extractVideo(url, content, options);
            assert.equal(file, undefined);

            assert.equal(spy.callCount, 0);
        });

        it("should return undefined when it's depther", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><head>
                               <meta property="og:video:type"
                                     content="text/html" />
                               <meta property="og:video"
                                     content="http://bar.com/baz.html" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: true };

            const file = await scraper.extractVideo(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return undefined when sub-page doesn't have media", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><head>
                               <meta property="og:video:type"
                                     content="text/html" />
                               <meta property="og:video"
                                     content="http://bar.com/baz.html" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: false };

            const file = await scraper.extractVideo(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return plugin URL", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><head>
                               <meta property="og:video:type"
                                     content="text/html" />
                               <meta property="og:video"
                                     content="https://www.twitch.tv/foo" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: false, incognito: true };

            const file = await scraper.extractVideo(url, content, options);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo",
            );
        });
    });

    describe("extractAudio()", function () {
        it("should return undefined when it isn't HTML", async function () {
            const url = new URL("https://foo.com");
            const content = { html: () => Promise.resolve(undefined) };
            const options = { depth: false };

            const file = await scraper.extractAudio(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return undefined when content is empty", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><head>
                               <meta property="og:audio:type"
                                     content="audio/mpeg" />
                               <meta property="og:audio" content="" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: false };

            const file = await scraper.extractAudio(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return audio URL when there isn't type", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><head>
                               <meta property="og:audio"
                                     content="https://bar.com/baz.mp3" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: false };

            const file = await scraper.extractAudio(url, content, options);
            assert.equal(file, "https://bar.com/baz.mp3");
        });

        it("should return audio URL", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><head>
                               <meta property="og:audio:type"
                                     content="audio/x-wav" />
                               <meta property="og:audio:secure_url"
                                     content="http://bar.com/baz.wav" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: false };

            const file = await scraper.extractAudio(url, content, options);
            assert.equal(file, "http://bar.com/baz.wav");
        });

        it("should return undefined when type isn't supported", async function () {
            const spy = sinon.stub(globalThis, "fetch");

            const url = new URL("https://foo.com");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><head>
                               <meta property="og:audio:type"
                                     content="bar/baz" />
                               <meta property="og:audio"
                                     content="http://qux.com/" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: false };

            const file = await scraper.extractAudio(url, content, options);
            assert.equal(file, undefined);

            assert.equal(spy.callCount, 0);
        });

        it("should return undefined when it's depther", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><head>
                               <meta property="og:audio:type"
                                     content="text/html" />
                               <meta property="og:audio"
                                     content="http://bar.com/baz.html" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: true };

            const file = await scraper.extractAudio(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return undefined when sub-page doesn't have media", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><head>
                               <meta property="og:audio:type"
                                     content="text/html" />
                               <meta property="og:audio"
                                     content="http://bar.com/baz.html" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: false };

            const file = await scraper.extractAudio(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return plugin URL", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><head>
                               <meta property="og:audio:type"
                                     content="text/html" />
                               <meta property="og:audio"
                                     content="https://www.mixcloud.com/foo` +
                                `/bar/" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: false };

            const file = await scraper.extractAudio(url, content, options);
            assert.equal(
                file,
                "plugin://plugin.audio.mixcloud/?mode=40&key=%2Ffoo%2Fbar%2F",
            );
        });
    });

    describe("extractTwitter()", function () {
        it("should return undefined when it isn't HTML", async function () {
            const url = new URL("https://foo.com");
            const content = { html: () => Promise.resolve(undefined) };

            const file = await scraper.extractTwitter(url, content);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't Open Graph", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            "<html><head></head></html>",
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractTwitter(url, content);
            assert.equal(file, undefined);
        });

        it("should return video URL", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><head>
                               <meta property="twitter:player:stream"
                                     content="https://bar.com/baz.avi" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractTwitter(url, content);
            assert.equal(file, "https://bar.com/baz.avi");
        });
    });

    describe("extractYandex()", function () {
        it("should return undefined when it isn't HTML", async function () {
            const url = new URL("https://foo.com");
            const content = { html: () => Promise.resolve(undefined) };

            const file = await scraper.extractYandex(url, content);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't Open Graph", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            "<html><head></head></html>",
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractYandex(url, content);
            assert.equal(file, undefined);
        });

        it("should return video URL", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><head>
                               <meta property="ya:ovs:content_url"
                                     content="https://bar.com/baz.avi" />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractYandex(url, content);
            assert.equal(file, "https://bar.com/baz.avi");
        });
    });
});
