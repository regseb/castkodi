import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Facebook", function () {
    it("should return URL when it's not a video", async function () {
        const url = "https://www.facebook.com/XBMC/videos/666/";
        const options = { "depth": 0, "incognito": false };
        const expected = url;

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return video URL", async function () {
        const url = "https://www.facebook.com/XBMC/videos/10152476888501641/";
        const options = { "depth": 0, "incognito": false };
        const expected = "/10840595_10152476888576641_527585110_n.mp4?";

        const file = await extract(new URL(url), options);
        assert.ok(file.includes(expected), `"${file}".includes(expected)`);
    });

    it("should return video URL when protocol is HTTP", async function () {
        const url = "http://www.facebook.com/XBMC/videos/10152476888501641/";
        const options = { "depth": 0, "incognito": false };
        const expected = "/10840595_10152476888576641_527585110_n.mp4?";

        const file = await extract(new URL(url), options);
        assert.ok(file.includes(expected), `"${file}".includes(expected)`);
    });

    it("should return video URL when it's mobile version", async function () {
        const url = "https://m.facebook.com/XBMC/videos/10152476888501641/";
        const options = { "depth": 0, "incognito": false };
        const expected = "/10840595_10152476888576641_527585110_n.mp4?";

        const file = await extract(new URL(url), options);
        assert.ok(file.includes(expected), `"${file}".includes(expected)`);
    });

    it("should return video URL when it's a live", async function () {
        const url = "https://www.facebook.com/foxcarolinanews/videos" +
                                                           "/2332364197043199/";
        const options = { "depth": 0, "incognito": false };
        const expected = "10000000_737031756806369_1300171264592888927_n.mp4?";

        const file = await extract(new URL(url), options);
        assert.ok(file.includes(expected), `"${file}".includes(expected)`);
    });

    it("should return URL when video doesn't exist", async function () {
        const url = "https://www.facebook.com/watch/?v=666";
        const options = { "depth": 0, "incognito": false };
        const expected = url;

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return URL when it's not video", async function () {
        const url = "https://www.facebook.com/watch/?x=315156812365737";
        const options = { "depth": 0, "incognito": false };
        const expected = url;

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return video URL from watch page", async function () {
        const url = "https://www.facebook.com/watch/?v=315156812365737";
        const options = { "depth": 0, "incognito": false };
        const expected = "/40059842_458664621312657_6558162886282182656_n.mp4?";

        const file = await extract(new URL(url), options);
        assert.ok(file.includes(expected), `"${file}".includes(expected)`);
    });

    it("should return video URL when protocol is HTTP from watch page",
                                                             async function () {
        const url = "http://www.facebook.com/watch?v=315156812365737";
        const options = { "depth": 0, "incognito": false };
        const expected = "/40059842_458664621312657_6558162886282182656_n.mp4?";

        const file = await extract(new URL(url), options);
        assert.ok(file.includes(expected), `"${file}".includes(expected)`);
    });
});
