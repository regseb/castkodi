import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";
import { config } from "../config.js";

describe("Scraper: Rumble", function () {
    before(function () {
        // """
        //  NOTICE TO USERS IN FRANCE
        //  Because of French government demands to remove creators from our
        //  platform, Rumble is currently unavailable in France. We are
        //  challenging these government demands and hope to restore access
        //  soon.
        // """
        if (undefined !== config.country && "us" !== config.country) {
            // eslint-disable-next-line no-invalid-this
            this.skip();
        }
    });

    it("should return video URL [opengraph-rumble]", async function () {
        const url = new URL("https://rumble.com/v1k2hrq-nasa-gets-set-to" +
                            "-crash-spacecraft-into-asteroid.html");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, "https://sp.rmbl.ws/s8/2/2/5/p/N/25pNf.haa.mp4");
    });

    it("should return video URL from embed", async function () {
        const url = new URL("https://rumble.com/embed/v1gga0u/?pub=4");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, "https://sp.rmbl.ws/s8/2/-/p/1/G/-p1Gf.haa.mp4");
    });
});
