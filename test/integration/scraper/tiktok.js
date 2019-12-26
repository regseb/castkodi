import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: TikTok", function () {
    it("should return video URL", async function () {
        const url = "https://www.tiktok.com/@the90guy/video" +
                                          "/6710341586984635654?langCountry=fr";
        const expected = "&lr=tiktok_m&qs=0&rc=ampvbHJwdnV4bjMzOjczM0ApPD" +
                             "M7OGU0aWU3NzM8aTY1PGc0azNhbmpja2NfLS0zMTZzczI1L" +
                                                  "zQyMF8yYV81X141LS06Yw%3D%3D";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.ok(file.endsWith(expected), `"${file}".endsWith(expected)`);
    });
});
