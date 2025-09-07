/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import { complete } from "../../../src/core/labelers.js";
import { extract } from "../../../src/core/scrapers.js";

const TUBED_ADDON = {
    addonid: "plugin.video.tubed",
    author: "anxdpanic",
    type: "xbmc.python.pluginsource",
};
const YOUTUBE_ADDON = {
    addonid: "plugin.video.youtube",
    author: "anxdpanic, bromix, MoojMidge",
    type: "xbmc.python.pluginsource",
};

describe("Labeler: YouTube", function () {
    afterEach(function () {
        mock.reset();
    });

    it("should return video label", async function () {
        await browser.storage.local.set({ "youtube-playlist": "video" });

        const url = new URL("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        const context = { depth: false, incognito: false };

        const file = /** @type {string} */ (await extract(url, context));
        const item = await complete({
            file,
            label: "play",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file,
            label:
                "Rick Astley - Never Gonna Give You Up (Official Music" +
                " Video)",
            position: 0,
            title: "",
            type: "unknown",
        });
    });

    it("should return video title", async function () {
        // Tester le cas quand la lecture de la vidéo est terminé et que
        // l'extension a modifié le titre.
        const item = await complete({
            file:
                "plugin://plugin.video.youtube/play/" +
                "?video_id=WBNjyvbqRYY&incognito=false",
            label: "La Marseillaise s’empare de Paris",
            position: 0,
            title: "La Marseillaise s’empare de Paris",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file:
                "plugin://plugin.video.youtube/play/" +
                "?video_id=WBNjyvbqRYY&incognito=false",
            label: "La Marseillaise s’empare de Paris",
            position: 0,
            title: "La Marseillaise s’empare de Paris",
            type: "unknown",
        });
    });

    it("should return unavailable label", async function () {
        await browser.storage.local.set({ "youtube-playlist": "video" });
        mock.method(kodi.addons, "getAddons", () =>
            Promise.resolve([TUBED_ADDON]),
        );

        const url = new URL("https://www.youtube.com/watch?v=v_cwYv4K2vo");
        const context = { depth: false, incognito: false };

        const file = /** @type {string} */ (await extract(url, context));
        const item = await complete({
            file,
            label: "",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file,
            label: "(Video unavailable)",
            position: 0,
            title: "",
            type: "unknown",
        });
    });

    it("should return unavailable label for private video", async function () {
        await browser.storage.local.set({ "youtube-playlist": "video" });
        mock.method(kodi.addons, "getAddons", () =>
            Promise.resolve([TUBED_ADDON]),
        );

        const url = new URL("https://www.youtube.com/watch?v=4fVLxS3BMpQ");
        const context = { depth: false, incognito: false };

        const file = /** @type {string} */ (await extract(url, context));
        const item = await complete({
            file,
            label: "",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file,
            label: "(Video unavailable)",
            position: 0,
            title: "",
            type: "unknown",
        });
    });

    it("should return playlist label", async function () {
        await browser.storage.local.set({ "youtube-playlist": "playlist" });
        mock.method(kodi.addons, "getAddons", () =>
            Promise.resolve([YOUTUBE_ADDON]),
        );

        const url = new URL(
            "https://www.youtube.com/playlist?list=PL6B3937A5D230E335",
        );
        const context = { depth: false, incognito: false };

        const file = /** @type {string} */ (await extract(url, context));
        const item = await complete({
            file,
            label: "",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file,
            label: "Official Blender Open Movies",
            position: 0,
            title: "",
            type: "unknown",
        });
    });

    it("should return mix label", async function () {
        await browser.storage.local.set({ "youtube-playlist": "playlist" });
        mock.method(kodi.addons, "getAddons", () =>
            Promise.resolve([TUBED_ADDON, YOUTUBE_ADDON]),
        );

        const url = new URL(
            "https://www.youtube.com/watch?v=Yrm_kb1d-Xc" +
                "&list=RDYrm_kb1d-Xc",
        );
        const context = { depth: false, incognito: false };

        const file = /** @type {string} */ (await extract(url, context));
        const item = await complete({
            file,
            label: "",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file,
            label: "Mix",
            position: 0,
            title: "",
            type: "unknown",
        });
    });

    it("should return mix label from YouTube Music", async function () {
        await browser.storage.local.set({ "youtube-playlist": "playlist" });

        const url = new URL(
            "https://music.youtube.com/watch?v=9bZkp7q19f0&list=RD9bZkp7q19f0",
        );
        const context = { depth: false, incognito: false };

        const file = /** @type {string} */ (await extract(url, context));
        const item = await complete({
            file,
            label: "",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file,
            label: "Mix",
            position: 0,
            title: "",
            type: "unknown",
        });
    });

    it("should return clip label", async function () {
        const url = new URL(
            "https://www.youtube.com/clip/UgkxI0KsdOZA-Pq3tUjucaib8b1tbixLMXhz",
        );
        const context = { depth: false, incognito: false };

        const file = /** @type {string} */ (await extract(url, context));
        const item = await complete({
            file,
            label: "",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file,
            label: "✂️ zyw000",
            position: 0,
            title: "",
            type: "unknown",
        });
    });
});
