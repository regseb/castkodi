import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Vimeo", function () {
    it("should return URL when it's not a video", async function () {
        const url = "https://vimeo.com/channels";
        const options = { depth: 0, incognito: false };
        const expected = url;

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return video id", async function () {
        const url = "https://vimeo.com/228786490";
        const options = { depth: 0, incognito: false };
        const expected = "plugin://plugin.video.vimeo/play/?video_id=228786490";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return video id when protocol is HTTP", async function () {
        const url = "http://vimeo.com/228786490";
        const options = { depth: 0, incognito: false };
        const expected = "plugin://plugin.video.vimeo/play/?video_id=228786490";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return URL when it's not a embed video", async function () {
        const url = "https://player.vimeo.com/video/foobar";
        const options = { depth: 0, incognito: false };
        const expected = url;

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return embed video id", async function () {
        const url = "https://player.vimeo.com/video/228786490";
        const options = { depth: 0, incognito: false };
        const expected = "plugin://plugin.video.vimeo/play/?video_id=228786490";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });
});
