import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("core/scrapers.js", function () {
    describe("extract()", function () {
        it("should return URL when it's not supported", async function () {
            const url = "https://kodi.tv/sites/default/themes/kodi/" +
                                                                 "logo-sbs.svg";
            const expected = url;

            const file = await extract(new URL(url), { "depth": 0 });
            assert.strictEqual(file, expected);
        });

        it("should return media URL", async function () {
            const url = "https://www.bitchute.com/video/dz5JcCZnJMge/";
            const expected = "https://seed126.bitchute.com/hU2elaB5u3kB" +
                                                            "/dz5JcCZnJMge.mp4";

            const file = await extract(new URL(url), { "depth": 0 });
            assert.strictEqual(file, expected);
        });

        it("should support URL", async function () {
            const url = "http://www.dailymotion.com/video/x17qw0a";
            const expected = "plugin://plugin.video.dailymotion_com/";

            const file = await extract(new URL(url), null, { "depth": 0 });
            assert.ok(file.startsWith(expected),
                      `"${file}".startsWith(expected)`);
        });

        it("should support uppercase URL", async function () {
            const url = "HTTPS://VIMEO.COM/195613867";
            const expected = "plugin://plugin.video.vimeo/";

            const file = await extract(new URL(url), { "depth": 0 });
            assert.ok(file.startsWith(expected),
                      `"${file}".startsWith(expected)`);
        });

        it("should support correctly question mark in pattern",
                                                             async function () {
            const url = "https://vid.ly/i2x4g5.mp4?quality=hd";

            const file = await extract(new URL(url), { "depth": 0 });
            assert.strictEqual(file, url);
        });

        it("should return the URL when it's a unsupported URL",
                                                             async function () {
            const url = "https://kodi.tv/";

            const file = await extract(new URL(url), { "depth": 0 });
            assert.strictEqual(file, url);
        });

        it("should return the URL when it's not a page HTML",
                                                             async function () {
            const url = "https://kodi.tv/sites/default/themes/kodi/" +
                                                                 "logo-sbs.svg";
            const file = await extract(new URL(url), { "depth": 0 });
            assert.strictEqual(file, url);
        });

        it("should return the MP3 URL", async function () {
            const url = "https://fr.wikipedia.org/wiki/awesome.MP3";

            const file = await extract(new URL(url), { "depth": 0 });
            assert.strictEqual(file, url);
        });

        it("should return the AVI URL", async function () {
            const url = "http://example.org/video.avi";

            const file = await extract(new URL(url), { "depth": 0 });
            assert.strictEqual(file, url);
        });
    });
});
