import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: HookTube", function () {
    it("should return video id", async function () {
        browser.storage.local.set({ "youtube-playlist": "video" });

        const url = "https://hooktube.com/watch?v=LACbVhgtx9I";
        const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=LACbVhgtx9I";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);

        browser.storage.local.clear();
    });

    it("should return embed video id", async function () {
        const url = "https://hooktube.com/embed/3lPSQ5KjamI";
        const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=3lPSQ5KjamI";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });
});
