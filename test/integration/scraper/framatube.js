import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Framatube", function () {
    it("should return video embed URL", async function () {
        const url = "https://framatube.org/videos/embed" +
                                        "/0900bd2e-7306-4c39-b48b-2d0cd611742e";
        const options = { "depth": 0, "incognito": false };
        const expected = "https://framatube.org/static/webseed" +
                               "/0900bd2e-7306-4c39-b48b-2d0cd611742e-1080.mp4";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return video URL when protocol is HTTP", async function () {
        const url = "http://framatube.org/videos/watch" +
                                        "/0b04f13d-1e18-4f1d-814e-4979aa7c9c44";
        const options = { "depth": 0, "incognito": false };
        const expected = "https://peertube.datagueule.tv/static/webseed" +
                               "/0b04f13d-1e18-4f1d-814e-4979aa7c9c44-1080.mp4";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });
});
