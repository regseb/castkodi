import assert from "node:assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: ARD Mediathek", function () {
    it("should return video URL", async function () {
        const url = new URL("https://www.ardmediathek.de/video/arte" +
                                 "/portraet-einer-jungen-frau-in-flammen/arte" +
                            "/Y3JpZDovL2FydGUudHYvdmlkZW9zLzEwMjIwMy0wMDAtQQ/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
                "plugin://plugin.video.ardmediathek_de/?client=ard" +
                                                            "&mode=libArdPlay" +
                          "&id=Y3JpZDovL2FydGUudHYvdmlkZW9zLzEwMjIwMy0wMDAtQQ");
    });
});
