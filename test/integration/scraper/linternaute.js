import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: L'internaute", function () {
    it("should return URL when it's not a video", async function () {
        const url = "https://www.linternaute.com/cinema/film" +
                                "/2462551-films-pixar-selection-des-meilleurs" +
                                           "-et-liste-de-tous-les-films-pixar/";
        const options = { depth: false, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, url);
    });

    it("should return video URL [ldjson]", async function () {
        const url = "https://www.linternaute.fr/cinema/tous-les-films" +
                                               "/2424867-les-enfants-du-temps/";
        const options = { depth: false, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file,
            "https://media.ccmbg.com/vc/767071118/852438/mp4/1577209511");
    });
});
