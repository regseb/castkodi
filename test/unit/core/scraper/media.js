/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/media.js";

describe("core/scraper/media.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://foo.com");
            const metadata = { html: () => Promise.resolve(undefined) };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't video or audio", async function () {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            "<html><body></body></html>",
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return undefined when src is invalid", async function () {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <video src />
                               <video src="" />
                               <video src="blob:https://foo.com/bar">
                                 <source src />
                                 <source src="" />
                                 <source src="blob:https://foo.com/baz">
                               </video>
                               <audio src />
                               <audio src="" />
                                 <source src />
                                 <source src="" />
                                 <source src="blob:https://foo.com/qux">
                               </audio>
                               <audio src="blob:https://foo.com/quux">
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return video URL", async function () {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <video src="/bar.mp4" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://foo.com/bar.mp4");
        });

        it("should return video URL from second video", async function () {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <video src="" />
                               <video src="/bar.mp4" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://foo.com/bar.mp4");
        });

        it("should return video URL from first source", async function () {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <video src="/bar.mp4" />
                               <video>
                                 <source src="/baz.mkv" />
                               </video>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://foo.com/baz.mkv");
        });

        it("should return audio URL", async function () {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <audio src="/bar.mp3" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://foo.com/bar.mp3");
        });

        it("should return audio URL from second audio", async function () {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <audio src="blob:https://foo.com/bar" />
                               <audio src="/baz.flac" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://foo.com/baz.flac");
        });

        it("should return audio URL from first source", async function () {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <audio src="/bar.mp3" />
                               <audio>
                                 <source src="/baz.wav" />
                               </audio>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://foo.com/baz.wav");
        });
    });
});
