import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Metacafe", function () {
    it("should return URL when it's not a video", async function () {
        const url = "https://www.metacafe.com/galleries/62479" +
                           "/just-let-these-pictures-do-the-explaining/305047/";
        const options = { depth: false, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, url);
    });

    it("should return video URL", async function () {
        const url = "https://www.metacafe.com/watch/11516798" +
                                    "/even-the-horse-showed-it-s-sympathy-for" +
                                        "-the-girl-who-just-couldn-t-climb-up/";
        const options = { depth: false, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file,
            "https://cdn.mcstatic.com/videos/11516000/11516798/11516798.m3u8");
    });
});
