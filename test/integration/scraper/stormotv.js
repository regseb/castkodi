import assert      from "assert";
import { config }  from "../config.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: StormoTV", function () {
    before(function () {
        if (null !== config.country && "fr" !== config.country) {
            // eslint-disable-next-line no-invalid-this
            this.skip();
        }
    });

    it("should return video URL [opengraph]", async function () {
        const url = "https://stormo.online/videos/244" +
                                            "/zvezdnye-voyny-probujdenie-sily/";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.ok(file.endsWith(".mp4/"), `"${file}".endsWith(...)`);
    });
});
