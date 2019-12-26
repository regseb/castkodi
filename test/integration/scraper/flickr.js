import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Flickr", function () {
    it("should return URL when it's not a video", async function () {
        const url = "http://www.flickr.com/photos/149130852@N05/40962531395/";
        const expected = url;

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return video URL", async function () {
        const url = "http://www.flickr.com/photos/brandonsphoto/9501379492/";
        const expected = "https://live.staticflickr.com/video/9501379492/" +
                                                          "b2e279c142/700.mp4?";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.ok(file.startsWith(expected), `"${file}".startsWith(expected)`);
    });
});
