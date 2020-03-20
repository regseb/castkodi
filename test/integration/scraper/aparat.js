import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: آپارات (Aparat)", function () {
    it("should return URL when it's not a show", async function () {
        const url = "https://www.aparat.com/movies";
        const options = { depth: 0, incognito: false };
        const expected = url;

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return show URL", async function () {
        const url = "https://www.aparat.com/v/IWTPf";
        const options = { depth: 0, incognito: false };
        const expected = "https://as11.cdn.asset.aparat.com/aparat-video" +
                             "/50e29576af712008fd3c439b21a345ec20298541-720p__";

        const file = await extract(new URL(url), options);
        assert.ok(file.startsWith(expected), `"${file}".startsWith(expected)`);
    });

    it("should return show URL when protocol is HTTP", async function () {
        const url = "http://www.aparat.com/v/Qk9jp";
        const options = { depth: 0, incognito: false };
        const expected = "https://as9.cdn.asset.aparat.com/aparat-video" +
                             "/294334a32a660e853e0fb546f12ec36b20286453-480p__";

        const file = await extract(new URL(url), options);
        assert.ok(file.startsWith(expected), `"${file}".startsWith(expected)`);
    });
});
