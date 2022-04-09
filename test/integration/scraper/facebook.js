import assert from "node:assert";
import { config } from "../config.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Facebook", function () {
    before(function () {
        if (undefined !== config.country && "fr" !== config.country) {
            // eslint-disable-next-line no-invalid-this
            this.skip();
        }
    });

    it("should return URL when it's not a video", async function () {
        const url = new URL("https://www.facebook.com/XBMC/videos/666/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return video URL [opengraph]", async function () {
        const url = new URL("https://www.facebook.com/XBMC/videos" +
                                                         "/10152476888501641/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(undefined !== file && new URL(file).pathname.endsWith(".mp4"),
                  `new URL("${file}").pathname.endsWith(...)`);
    });

    it("should return video URL when protocol is HTTP [opengraph]",
                                                             async function () {
        const url = new URL("http://www.facebook.com/XBMC/videos" +
                                                         "/10152476888501641/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(undefined !== file && new URL(file).pathname.endsWith(".mp4"),
                  `new URL("${file}").pathname.endsWith(...)`);
    });

    it("should return video URL when it's mobile version [opengraph]",
                                                             async function () {
        const url = new URL("https://m.facebook.com/XBMC/videos" +
                                                         "/10152476888501641/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(undefined !== file && new URL(file).pathname.endsWith(".mp4"),
                  `new URL("${file}").pathname.endsWith(...)`);
    });

    it("should return video URL when it's a live [opengraph]",
                                                             async function () {
        const url = new URL("https://www.facebook.com/foxcarolinanews/videos" +
                                                          "/2332364197043199/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(undefined !== file && new URL(file).pathname.endsWith(".mp4"),
                  `new URL("${file}").pathname.endsWith(...)`);
    });

    it("should return URL when video doesn't exist [opengraph]",
                                                             async function () {
        const url = new URL("https://www.facebook.com/watch/?v=666");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return URL when it's not video [opengraph]", async function () {
        const url = new URL("https://www.facebook.com/watch/" +
                                                          "?x=315156812365737");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return video URL from watch page [opengraph]",
                                                             async function () {
        const url = new URL("https://www.facebook.com/watch/" +
                                                          "?v=315156812365737");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(undefined !== file && new URL(file).pathname.endsWith(".mp4"),
                  `new URL("${file}").pathname.endsWith(...)`);
    });

    it("should return video URL when protocol is HTTP from watch page" +
                                              "[opengraph]", async function () {
        const url = new URL("http://www.facebook.com/watch?v=315156812365737");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(undefined !== file && new URL(file).pathname.endsWith(".mp4"),
                  `new URL("${file}").pathname.endsWith(...)`);
    });
});
