import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/facebook.js";

describe("scraper/facebook", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL",
                                                             async function () {
            const url = "https://www.facebook.com/mozilla/";

            const file = await extract(url);
            assert.strictEqual(file, url);
        });
    });

    describe("*://*.facebook.com/*/videos/*/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a video", async function () {
            const url = "https://www.facebook.com/XBMC/videos/666/";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            const url = "https://www.facebook.com/XBMC/videos" +
                                                          "/10152476888501641/";
            const expected = "/10840595_10152476888576641_527585110_n.mp4?";

            const file = await action(new URL(url));
            assert.ok(file.includes(expected),
                      `"${file}".includes(expected)`);
        });

        it("should return video URL when protocol is HTTP", async function () {
            const url = "http://www.facebook.com/XBMC/videos" +
                                                          "/10152476888501641/";
            const expected = "/10840595_10152476888576641_527585110_n.mp4?";

            const file = await action(new URL(url));
            assert.ok(file.includes(expected),
                      `"${file}".includes(expected)`);
        });

        it("should return video URL when it's mobile version",
                                                             async function () {
            const url = "https://m.facebook.com/XBMC/videos/10152476888501641/";
            const expected = "/10840595_10152476888576641_527585110_n.mp4?";

            const file = await action(new URL(url));
            assert.ok(file.includes(expected),
                      `"${file}".includes(expected)`);
        });

        it("should return video URL when it's a live", async function () {
            const url = "https://www.facebook.com/foxcarolinanews/videos" +
                                                           "/2332364197043199/";
            const expected = "/10000000_208598786795030" +
                                                   "_8145254727672507928_n.mp4";

            const file = await action(new URL(url));
            assert.ok(file.includes(expected),
                      `"${file}".includes(expected)`);
        });
    });

    describe("*://*.facebook.com/watch*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when video doesn't exist", async function () {
            const url = "https://www.facebook.com/watch/?v=666";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not video", async function () {
            const url = "https://www.facebook.com/watch/?x=315156812365737";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            const url = "https://www.facebook.com/watch/?v=315156812365737";
            const expected = "/40059842_458664621312657_6558162886282182656" +
                                                                      "_n.mp4?";

            const file = await action(new URL(url));
            assert.ok(file.includes(expected),
                      `"${file}".includes(expected)`);
        });

        it("should return video URL when protocol is HTTP", async function () {
            const url = "http://www.facebook.com/watch?v=315156812365737";
            const expected = "/40059842_458664621312657_6558162886282182656" +
                                                                      "_n.mp4?";

            const file = await action(new URL(url));
            assert.ok(file.includes(expected),
                      `"${file}".includes(expected)`);
        });
    });
});
