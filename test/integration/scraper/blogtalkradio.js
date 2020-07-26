import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Blog Talk Radio", function () {
    it("should return null when it's not an audio", async function () {
        const url = new URL("https://www.blogtalkradio.com/technology");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return audio URL", async function () {
        const url = new URL("https://www.blogtalkradio.com/stretchingadollar" +
                               "/2011/03/02/7-mozilla-firefox-add-ons-to-help" +
                               "-your-small-business-stretch-a-dollar-to-save");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://www.blogtalkradio.com/stretchingadollar" +
                               "/2011/03/02/7-mozilla-firefox-add-ons-to-help" +
                           "-your-small-business-stretch-a-dollar-to-save.mp3");
    });

    it("should return audio URL when protocol is HTTP", async function () {
        const url = new URL("http://www.blogtalkradio.com/firefoxnews-online" +
                                              "/2011/06/13/firefoxnews-online");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://www.blogtalkradio.com/firefoxnews-online" +
                                          "/2011/06/13/firefoxnews-online.mp3");
    });
});
