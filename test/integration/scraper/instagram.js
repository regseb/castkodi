import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Instagram", function () {
    it("should return URL when it's not a video", async function () {
        const url = "https://www.instagram.com/p/6p_BDeK-8G/";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, url);
    });

    it("should return video URL", async function () {
        const url = "https://www.instagram.com/p/BpFwZ6JnYPq/";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.ok(file.includes("/43507506_351933205369613" +
                                                 "_6559511411523846144_n.mp4?"),
                  `"${file}".includes(...)`);
    });

    it("should return video URL when protocol is HTTP", async function () {
        const url = "https://www.instagram.com/p/Bpji87LiJFs/";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.ok(file.includes("/44876841_340575853170202" +
                                                 "_7413375163648966656_n.mp4?"),
                  `"${file}".includes(...)`);
    });
});
