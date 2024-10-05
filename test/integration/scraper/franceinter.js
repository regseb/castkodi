/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: France Inter", function () {
    it("should return audio URL [ldjson]", async function () {
        const url = new URL(
            "https://www.franceinter.fr/emissions/blockbusters" +
                "/blockbusters-19-juillet-2019",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://media.radiofrance-podcast.net/podcast09" +
                "/17309-19.07.2019-ITEMA_22112050-0.mp3",
        );
    });
});
