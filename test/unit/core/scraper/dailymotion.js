/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
import * as scraper from "../../../../src/core/scraper/dailymotion.js";

describe("core/scraper/dailymotion.js", function () {
    describe("extractVideo()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.dailymotion.com/fr/feed");

            const file = await scraper.extractVideo(url);
            assert.equal(file, undefined);
        });

        it("should return video id", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://www.dailymotion.com/video/foo");

            const file = await scraper.extractVideo(url);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video id to dailymotion", async function () {
            const stub = sinon
                .stub(kodi.addons, "getAddons")
                .resolves([
                    "plugin.video.dailymotion_com",
                    "plugin.video.sendtokodi",
                ]);

            const url = new URL("https://www.dailymotion.com/video/foo");

            const file = await scraper.extractVideo(url);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video URL to sendtokodi", async function () {
            const stub = sinon
                .stub(kodi.addons, "getAddons")
                .resolves(["plugin.video.sendtokodi"]);

            const url = new URL("https://www.dailymotion.com/video/foo");

            const file = await scraper.extractVideo(url);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/" +
                    "?https://www.dailymotion.com/video/foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });
    });

    describe("extractMinify()", function () {
        it("should return tiny video id", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://dai.ly/foo");

            const file = await scraper.extractMinify(url);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });
    });

    describe("extractEmbed()", function () {
        it("should return embed video id", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://www.dailymotion.com/embed/video/foo");

            const file = await scraper.extractEmbed(url);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });
    });

    describe("extractPlayerScript()", function () {
        it("should return undefined when it isn't HTML", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://foo.com/");
            const metadata = { html: () => Promise.resolve(undefined) };

            const file = await scraper.extractPlayerScript(url, metadata);
            assert.equal(file, undefined);

            assert.equal(stub.callCount, 0);
        });

        it("should return undefined when there isn't Dailymotion player", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://foo.com/");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            "<html><head></head></html>",
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractPlayerScript(url, metadata);
            assert.equal(file, undefined);

            assert.equal(stub.callCount, 0);
        });

        it("should return video id", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://foo.com/");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `
                    <html><head>
                      <script src="https://geo.dailymotion.com/bar.js"></script>
                      <script src="https://geo.dailymotion.com/player/baz.js"
                              data-video="qux"></script>
                    </head></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractPlayerScript(url, metadata);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=qux",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });
    });

    describe("extractPlayerIframe()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.dailymotion.com/player/foo");

            const file = await scraper.extractPlayerIframe(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't video id", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://geo.dailymotion.com/player/foo");

            const file = await scraper.extractPlayerIframe(url);
            assert.equal(file, undefined);

            assert.equal(stub.callCount, 0);
        });

        it("should return video id", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL(
                "https://geo.dailymotion.com/player/foo?video=bar",
            );

            const file = await scraper.extractPlayerIframe(url);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=bar",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });
    });
});
