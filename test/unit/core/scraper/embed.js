/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
import * as scraper from "../../../../src/core/scraper/embed.js";

describe("core/scraper/embed.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://foo.com/bar.zip");
            const metadata = { html: () => Promise.resolve(undefined) };
            const context = { depth: false, incognito: true };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't embed", async function () {
            const url = new URL("https://foo.com/bar.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            "<html><body></body></html>",
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: true };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should ignore src empty", async function () {
            const url = new URL("https://foo.com/bar.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <embed type="video/mp4" src="" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: true };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should ignore blob", async function () {
            const url = new URL("https://foo.com/bar.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <embed type="video/mp4"
                                      src="blob:https://foo.com/baz" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: true };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return URL from video embed", async function () {
            const url = new URL("https://foo.com/bar.html");
            const metadata = {
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
            const context = { depth: false, incognito: true };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, "https://foo.com/baz.mp4");
        });

        it("should return URL from audio embed", async function () {
            const url = new URL("https://foo.com/bar.html");
            const metadata = {
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
            const context = { depth: false, incognito: true };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, "https://foo.com/baz.mp3");
        });

        it("should return URL from other page embed", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://foo.com/bar.html");
            const metadata = {
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
            const context = { depth: false, incognito: true };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.vimeo/play/?video_id=baz",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return undefined when it's depth", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://foo.com/bar.html");
            const metadata = {
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
            const context = { depth: true, incognito: true };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);

            assert.equal(stub.callCount, 0);
        });

        it("should return URL from second embed", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://www.dailymotion.com/index.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <embed src="https://exemple.com/data.zip" />
                               <embed src="/embed/video/foo" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/" +
                    "?mode=playVideo&url=foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });
    });
});
