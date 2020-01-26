import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Invidious", function () {
    it("should return video id", async function () {
        browser.storage.local.set({ "youtube-playlist": "video" });

        const url = "https://invidio.us/watch?v=e6EQwSadpPk";
        const options = { "depth": 0, "incognito": true };
        const expected = "plugin://plugin.video.youtube/play/" +
                                                       "?video_id=e6EQwSadpPk" +
                                                       "&incognito=true";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);

        browser.storage.local.clear();
    });

    it("should return embed video id", async function () {
        const url = "https://invidio.us/embed/8cmBd7lkunk";
        const options = { "depth": 0, "incognito": false };
        const expected = "plugin://plugin.video.youtube/play/" +
                                                       "?video_id=8cmBd7lkunk" +
                                                       "&incognito=false";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });
});
