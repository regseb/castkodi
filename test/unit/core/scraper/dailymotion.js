/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
import * as scraper from "../../../../src/core/scraper/dailymotion.js";

const DAILYMOTION_ADDON = {
    addonid: "plugin.video.dailymotion_com",
    author: "gujal",
    type: "xbmc.python.pluginsource",
};
const OTHER_ADDON = {
    addonid: "plugin.video.other",
    author: "johndoe",
    type: "xbmc.python.pluginsource",
};
const SENDTOKODI_ADDON = {
    addonid: "plugin.video.sendtokodi",
    author: "firsttris",
    type: "xbmc.python.pluginsource",
};

describe("core/scraper/dailymotion.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extractVideo()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.dailymotion.com/fr/feed");

            const file = await scraper.extractVideo(url);
            assert.equal(file, undefined);
        });

        it("should return video id", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.dailymotion.com/video/foo");

            const file = await scraper.extractVideo(url);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id to dailymotion", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([DAILYMOTION_ADDON, SENDTOKODI_ADDON]),
            );

            const url = new URL("https://www.dailymotion.com/video/foo");

            const file = await scraper.extractVideo(url);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video URL to sendtokodi", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([SENDTOKODI_ADDON]),
            );

            const url = new URL("https://www.dailymotion.com/video/foo");

            const file = await scraper.extractVideo(url);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/" +
                    "?https://www.dailymotion.com/video/foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id to dailymotion by default", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([OTHER_ADDON]),
            );

            const url = new URL("https://www.dailymotion.com/video/foo");

            const file = await scraper.extractVideo(url);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });

    describe("extractMinify()", function () {
        it("should return tiny video id", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://dai.ly/foo");

            const file = await scraper.extractMinify(url);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });

    describe("extractEmbed()", function () {
        it("should return embed video id", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.dailymotion.com/embed/video/foo");

            const file = await scraper.extractEmbed(url);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });

    describe("extractPlayerScript()", function () {
        it("should return undefined when it isn't HTML", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons");

            const url = new URL("https://foo.com/");
            const metadata = { html: () => Promise.resolve(undefined) };

            const file = await scraper.extractPlayerScript(url, metadata);
            assert.equal(file, undefined);

            assert.equal(getAddons.mock.callCount(), 0);
        });

        it("should return undefined when there isn't Dailymotion player", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons");

            const url = new URL("https://foo.com/");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            '<html lang="en"><head></head></html>',
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractPlayerScript(url, metadata);
            assert.equal(file, undefined);

            assert.equal(getAddons.mock.callCount(), 0);
        });

        it("should return video id", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://foo.com/");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><head>
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

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });

    describe("extractPlayerIframe()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.dailymotion.com/player/foo");

            const file = await scraper.extractPlayerIframe(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't video id", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons");

            const url = new URL("https://geo.dailymotion.com/player/foo");

            const file = await scraper.extractPlayerIframe(url);
            assert.equal(file, undefined);

            assert.equal(getAddons.mock.callCount(), 0);
        });

        it("should return video id", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL(
                "https://geo.dailymotion.com/player/foo?video=bar",
            );

            const file = await scraper.extractPlayerIframe(url);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=bar",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });
});
