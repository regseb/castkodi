/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
import * as scraper from "../../../../src/core/scraper/mixcloud.js";

const MIXCLOUD_ADDON = {
    addonid: "plugin.audio.mixcloud",
    author: "jackyNIX",
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

describe("core/scraper/mixcloud.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.mixcloud.com/upload/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't an audio", async function () {
            const url = new URL("https://www.mixcloud.com/discover/foo/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return audio id", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.mixcloud.com/foo/bar/");

            const file = await scraper.extract(url);
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

        it("should return audio id to mixcloud", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([MIXCLOUD_ADDON, SENDTOKODI_ADDON]),
            );

            const url = new URL("https://www.mixcloud.com/foo/bar/");

            const file = await scraper.extract(url);
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

        it("should return video url to sendtokodi", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([SENDTOKODI_ADDON]),
            );

            const url = new URL("https://www.mixcloud.com/foo/bar/");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/" +
                    "?https://www.mixcloud.com/foo/bar/",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, [
                "audio",
                "video",
            ]);
        });

        it("should return audio id to mixcloud by default", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([OTHER_ADDON]),
            );

            const url = new URL("https://www.mixcloud.com/foo/bar/");

            const file = await scraper.extract(url);
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
});
