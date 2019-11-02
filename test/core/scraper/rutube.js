import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/rutube.js";

describe("scraper/rutube", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://rutube.ru/index/hot/";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://rutube.ru/video/*/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a video", function () {
            const url = "https://rutube.ru/video/no_id/";
            const expected = null;

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not a video with id", function () {
            const url = "https://rutube.ru/video/0a1b2c3d4e5/";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video URL", function () {
            const url = "https://rutube.ru/video" +
                                          "/c3290999478b6c11addf33b26f4ca81c/" +
                                                  "?pl_id=2664175&pl_type=user";
            const expected = "https://bl.rutube.ru/route" +
                                      "/c3290999478b6c11addf33b26f4ca81c.m3u8?";
            return action(new URL(url)).then(function (file) {
                assert.ok(file.startsWith(expected),
                          `"${file}".startsWith(expected)`);
            });
        });
    });

    describe("*://rutube.ru/play/embed/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when access isn't allowed", function () {
            const url = "https://rutube.ru/play/embed/1";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video URL", function () {
            const url = "https://rutube.ru/play/embed/11318635";
            const expected = "https://bl.rutube.ru/route" +
                                      "/7fa99a98331d643cc44d4f529fba762a.m3u8?";
            return action(new URL(url)).then(function (file) {
                assert.ok(file.startsWith(expected),
                          `"${file}".startsWith(expected)`);
            });
        });

        it("should return video URL when protocol is HTTP ", function () {
            const url = "http://rutube.ru/play/embed/11318635";
            const expected = "https://bl.rutube.ru/route" +
                                      "/7fa99a98331d643cc44d4f529fba762a.m3u8?";
            return action(new URL(url)).then(function (file) {
                assert.ok(file.startsWith(expected),
                          `"${file}".startsWith(expected)`);
            });
        });
    });
});
