/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

// FIXME Désactiver temporairement VidLii.
//       """
//        Technical Difficulties
//
//        VidLii is currently experiencing technical difficulties with its
//        network.
//        We are working to resolve the situation as soon as possible.
//
//        2024/01/14: We have restored backups and will provide updates within
//        the week.
//
//        2024/01/22: We have selected a new network to work with, and we hope
//        to be back online within less than a month
//
//        2024/01/27: The site should be functional in the next few days
//       """
describe.skip("Scraper: VidLii", function () {
    it("should return undefined when it isn't a video", async function () {
        const url = new URL("https://www.vidlii.com/help");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL [video]", async function () {
        const url = new URL("https://www.vidlii.com/watch?v=2Ng8Abj2Fkl");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://www.vidlii.com/usfi/v/2Ng8Abj2Fkl.QfHzede4RBuRpC3G8glW4C" +
                "EDhFqKump_9NV0-enDJuqAGNLpWGSUVxr6RknIf63c4dOWAKdbBx-MBP__" +
                ".mp4",
        );
    });
});
