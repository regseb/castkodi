import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: HookTube", function () {
    it("should return video id [youtube]", async function () {
        browser.storage.local.set({ "youtube-playlist": "video" });

        const url = "https://hooktube.com/watch?v=LACbVhgtx9I";
        const options = { depth: false, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file,
            "plugin://plugin.video.youtube/play/?video_id=LACbVhgtx9I" +
                                                            "&incognito=false");

        browser.storage.local.clear();
    });

    it("should return embed video id [youtube]", async function () {
        const url = "https://hooktube.com/embed/3lPSQ5KjamI";
        const options = { depth: false, incognito: true };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file,
            "plugin://plugin.video.youtube/play/?video_id=3lPSQ5KjamI" +
                                                             "&incognito=true");
    });
});
