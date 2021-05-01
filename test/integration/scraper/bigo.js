import assert from "node:assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Bigo Live", function () {
    it("should return URL when it's not a video", async function () {
        const url = new URL("https://www.bigo.tv/games");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return video URL", async function () {
        // Récupérer l'URL d'une vidéo avec l'API de Bigo Live.
        const response = await fetch(
            "https://www.bigo.tv/openOfficialWeb/vedioList/",
            { headers: { "X-Requested-With": "XMLHttpRequest" } },
        );
        const json = await response.json();

        const url = new URL("https://www.bigo.tv/" + json[0].bigo_id);
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(new URL(file).pathname.endsWith(".m3u8"),
                  `new URL("${file}").pathname.endsWith(...) from ${url}`);
    });
});
