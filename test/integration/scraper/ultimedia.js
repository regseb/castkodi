import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Ultimedia", function () {
    it("should return URL when it's not an audio", async function () {
        const url = new URL("https://www.ultimedia.com/default/presentation" +
                                                                        "/cgu");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return video URL", async function () {
        const url = new URL("https://www.ultimedia.com/default/index" +
                                                     "/videogeneric/id/pms83v");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(new URL(file).pathname.endsWith(".mp4"),
                  `new URL("${file}").pathname.endsWith(...)`);
    });

    it("should return video URL when protocol is HTTP", async function () {
        const url = new URL("http://www.ultimedia.com/default/index" +
                                                     "/videogeneric/id/8lflp5");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(new URL(file).pathname.endsWith(".mp4"),
                  `new URL("${file}").pathname.endsWith(...)`);
    });

    it("should return video URL from embed", async function () {
        const url = new URL("https://www.ultimedia.com/deliver/generic" +
                        "/iframe/mdtk/01836272/src/pzmpzr/zone/1/showtitle/1/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(new URL(file).pathname.endsWith(".mp4"),
                  `new URL("${file}").pathname.endsWith(...)`);
    });
});
