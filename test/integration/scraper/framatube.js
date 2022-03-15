import assert from "node:assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Framatube", function () {
    it("should return URL when UUID is invalid [peertube]", async function () {
        const url = new URL("https://framatube.org/w" +
                                       "/123e4567-e89b-12d3-a456-426614174000");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return video embed URL [peertube]", async function () {
        const url = new URL("https://framatube.org/w" +
                                       "/0900bd2e-7306-4c39-b48b-2d0cd611742e");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://framatube.org/static/webseed" +
                              "/0900bd2e-7306-4c39-b48b-2d0cd611742e-1080.mp4");
    });

    it("should return video URL when protocol is HTTP [peertube]",
                                                             async function () {
        const url = new URL("http://framatube.org/videos/watch" +
                                       "/0b04f13d-1e18-4f1d-814e-4979aa7c9c44");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://peertube.datagueule.tv/static/streaming-playlists/hls" +
                                       "/0b04f13d-1e18-4f1d-814e-4979aa7c9c44" +
                           "/7826a4da-8721-4dfd-8140-53d4cc6bb34e-master.m3u8");
    });
});
