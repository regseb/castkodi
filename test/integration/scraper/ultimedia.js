import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Ultimedia", function () {
    it("should return URL when it's not an audio", async function () {
        const url = "https://www.ultimedia.com/default/presentation/cgu";
        const expected = url;

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return video URL", async function () {
        const url = "https://www.ultimedia.com/default/index/videogeneric/id" +
                                                                      "/pms83v";
        const expected = "f1/84/f184a3218cbc7fd3d9cc6f4ac3e06ef7cb971753.mp4" +
                                                               "?mdtk=01601930";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.ok(file.endsWith(expected), `"${file}".endsWith(expected)`);
    });

    it("should return video URL when protocol is HTTP", async function () {
        const url = "http://www.ultimedia.com/default/index/videogeneric/id" +
                                                                      "/8lflp5";
        const expected = "/2f/89/2f89cbc343c0d91d934129c541dd854b020e5f14.mp4" +
                                                               "?mdtk=01601930";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.ok(file.endsWith(expected), `"${file}".endsWith(expected)`);
    });

    it("should return video URL from embed", async function () {
        const url = "https://www.ultimedia.com/deliver/generic/iframe/mdtk" +
                                     "/01836272/src/pzmpzr/zone/1/showtitle/1/";
        const expected = "/f6/5c/f65ca8f12f314060fd3ed79e9d0e66ace641a800.mp4" +
                                                               "?mdtk=01836272";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.ok(file.endsWith(expected), `"${file}".endsWith(expected)`);
    });
});
