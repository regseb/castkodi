import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Ultimedia", function () {
    it("should return URL when it's not an audio", async function () {
        const url = "https://www.ultimedia.com/default/presentation/cgu";
        const options = { depth: 0, incognito: false };
        const expected = url;

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return video URL", async function () {
        const url = "https://www.ultimedia.com/default/index/videogeneric/id" +
                                                                      "/pms83v";
        const options = { depth: 0, incognito: false };
        const expected = ".mp4";

        const file = await extract(new URL(url), options);
        assert.ok(new URL(file).pathname.endsWith(expected),
                  `new URL("${file}").pathname.endsWith(expected)`);
    });

    it("should return video URL when protocol is HTTP", async function () {
        const url = "http://www.ultimedia.com/default/index/videogeneric/id" +
                                                                      "/8lflp5";
        const options = { depth: 0, incognito: false };
        const expected = ".mp4";

        const file = await extract(new URL(url), options);
        assert.ok(new URL(file).pathname.endsWith(expected),
                  `new URL("${file}").pathname.endsWith(expected)`);
    });

    it("should return video URL from embed", async function () {
        const url = "https://www.ultimedia.com/deliver/generic/iframe/mdtk" +
                                     "/01836272/src/pzmpzr/zone/1/showtitle/1/";
        const options = { depth: 0, incognito: false };
        const expected = ".mp4";

        const file = await extract(new URL(url), options);
        assert.ok(new URL(file).pathname.endsWith(expected),
                  `new URL("${file}").pathname.endsWith(expected)`);
    });
});
