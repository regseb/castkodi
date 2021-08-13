import assert from "node:assert";
import { extract } from "../../../src/core/scrapers.js";
import { complete } from "../../../src/core/labellers.js";

describe("Labeller: YouTube", function () {
    it("should return video label", async function () {
        browser.storage.local.set({ "youtube-playlist": "video" });

        const url = new URL("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        const item = await complete({
            file,
            label:    "play",
            position: 0,
            title:    "",
            type:     "unknown",
        });
        assert.deepStrictEqual(item, {
            file,
            label:    "Rick Astley - Never Gonna Give You Up (Official Music" +
                                                                      " Video)",
            position: 0,
            title:    "",
            type:     "unknown",
        });

        browser.storage.local.clear();
    });

    it("should return video title", async function () {
        // Tester le cas quand la lecture de la vidéo est terminé et que
        // l'extension a modifié le titre.
        const item = await complete({
            file:     "plugin://plugin.video.youtube/play/" +
                                        "?video_id=WBNjyvbqRYY&incognito=false",
            label:    "La Marseillaise s’empare de Paris",
            position: 0,
            title:    "La Marseillaise s’empare de Paris",
            type:     "unknown",
        });
        assert.deepStrictEqual(item, {
            file:     "plugin://plugin.video.youtube/play/" +
                                        "?video_id=WBNjyvbqRYY&incognito=false",
            label:    "La Marseillaise s’empare de Paris",
            position: 0,
            title:    "La Marseillaise s’empare de Paris",
            type:     "unknown",
        });
    });

    it("should return unavailable label", async function () {
        browser.storage.local.set({ "youtube-playlist": "video" });

        const url = new URL("https://www.youtube.com/watch?v=v_cwYv4K2vo");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        const item = await complete({
            file,
            label:    "",
            position: 0,
            title:    "",
            type:     "unknown",
        });
        assert.deepStrictEqual(item, {
            file,
            label:    "(Video unavailable)",
            position: 0,
            title:    "",
            type:     "unknown",
        });

        browser.storage.local.clear();
    });

    it("should return playlist label", async function () {
        browser.storage.local.set({ "youtube-playlist": "playlist" });

        const url = new URL("https://www.youtube.com/playlist" +
                                                    "?list=PL6B3937A5D230E335");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        const item = await complete({
            file,
            label:    "",
            position: 0,
            title:    "",
            type:     "unknown",
        });
        assert.deepStrictEqual(item, {
            file,
            label:    "Official Blender Open Movies",
            position: 0,
            title:    "",
            type:     "unknown",
        });

        browser.storage.local.clear();
    });

    it("should return mix label", async function () {
        browser.storage.local.set({ "youtube-playlist": "playlist" });

        const url = new URL("https://www.youtube.com/watch" +
                                           "?v=Yrm_kb1d-Xc&list=RDYrm_kb1d-Xc");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        const item = await complete({
            file,
            label:    "",
            position: 0,
            title:    "",
            type:     "unknown",
        });
        assert.deepStrictEqual(item, {
            file,
            label:    "Mix",
            position: 0,
            title:    "",
            type:     "unknown",
        });

        browser.storage.local.clear();
    });

    it("should return mix label from YouTube Music", async function () {
        browser.storage.local.set({ "youtube-playlist": "playlist" });

        const url = new URL("https://music.youtube.com/watch" +
                                           "?v=9bZkp7q19f0&list=RD9bZkp7q19f0");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        const item = await complete({
            file,
            label:    "",
            position: 0,
            title:    "",
            type:     "unknown",
        });
        assert.deepStrictEqual(item, {
            file,
            label:    "Mix",
            position: 0,
            title:    "",
            type:     "unknown",
        });

        browser.storage.local.clear();
    });
});
