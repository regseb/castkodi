import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Daily Mail", function () {
    it("should return audio URL [opengraph]", async function () {
        const url = new URL("https://www.dailymail.co.uk/sciencetech" +
                            "/article-8057229" +
                            "/Scientists-create-stunning-gifs-Mars-sand-dunes" +
                            "-understand-conditions-impact-them.html");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file,
            "https://videos.dailymail.co.uk/video/mol/2019/12/12" +
                "/4423536678317962457/1024x576_MP4_4423536678317962457.mp4");
    });
});
