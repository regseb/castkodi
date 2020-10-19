import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Megaphone", function () {
    it("should return video URL", async function () {
        const url = new URL("https://player.megaphone.fm/SLT2646036872?");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, "https://dcs.megaphone.fm/SLT2646036872.mp3");
    });

    it("should return video URL when protocol is HTTP ", async function () {
        const url = new URL("http://player.megaphone.fm/SLT5236779375");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, "https://dcs.megaphone.fm/SLT5236779375.mp3");
    });

    it("should return video URL from playlist", async function () {
        const url = new URL("https://playlist.megaphone.fm?e=SLT5884670747");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, "https://dcs.megaphone.fm/SLT5884670747.mp3");
    });
});
