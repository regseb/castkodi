import assert                 from "assert";
import { extract as scraper } from "../../../src/core/scrapers.js";
import { extract }            from "../../../src/core/labellers.js";

describe("Labeller: YouTube", function () {
    it("should return video label", async function () {
        browser.storage.local.set({ "youtube-playlist": "video" });

        const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        const options = { depth: 0, incognito: false };

        const file = await scraper(new URL(url), options);
        const label = await extract({ file, label: "" });
        assert.strictEqual(label,
            "Rick Astley - Never Gonna Give You Up (Video)");

        browser.storage.local.clear();
    });

    it("should return playlist label", async function () {
        browser.storage.local.set({ "youtube-playlist": "playlist" });

        const url = "https://www.youtube.com/playlist?list=PL6B3937A5D230E335";
        const options = { depth: 0, incognito: false };

        const file = await scraper(new URL(url), options);
        const label = await extract({ file, label: "" });
        assert.strictEqual(label, "Official Blender Open Movies");

        browser.storage.local.clear();
    });

    it("should return mix label", async function () {
        browser.storage.local.set({ "youtube-playlist": "playlist" });

        const url = "https://music.youtube.com/watch?v=9bZkp7q19f0" +
                                                   "&list=RD9bZkp7q19f0";
        const options = { depth: 0, incognito: false };

        const file = await scraper(new URL(url), options);
        const label = await extract({ file, label: "" });
        assert.strictEqual(label, "My Mix");

        browser.storage.local.clear();
    });
});
