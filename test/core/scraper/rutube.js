import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

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
        it("should return error when it's not a video", function () {
            const url = "https://rutube.ru/video/no_id/";
            const expected = "noVideo";
            return extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected),
                          `"${error.title}".includes(expected)`);
                assert.ok(error.message.includes(expected),
                          `"${error.message}".includes(expected)`);
            });
        });

        it("should return error when it's not a video", function () {
            const url = "https://rutube.ru/video/0a1b2c3d4e5/";
            const expected = "noVideo";
            return extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected),
                          `"${error.title}".includes(expected)`);
                assert.ok(error.message.includes(expected),
                          `"${error.message}".includes(expected)`);
            });
        });

        it("should return video id", function () {
            const url = "https://rutube.ru/video/" +
                 "c3290999478b6c11addf33b26f4ca81c/?pl_id=2664175&pl_type=user";
            const expected = "https://bl.rutube.ru/route/" +
                                        "c3290999478b6c11addf33b26f4ca81c.m3u8";
            return extract(url).then(function (file) {
                assert.ok(file.startsWith(expected),
                          `"${file}".startsWith(expected)`);
            });
        });
    });

    describe("*://rutube.ru/play/embed/*", function () {
        it("should return video id when protocol is HTTP ", function () {
            const url = "http://rutube.ru/play/embed/11318635";
            const expected = "https://bl.rutube.ru/route/" +
                                        "7fa99a98331d643cc44d4f529fba762a.m3u8";
            return extract(url).then(function (file) {
                assert.ok(file.startsWith(expected),
                          `"${file}".startsWith(expected)`);
            });
        });

        it("should return video id", function () {
            const url = "https://rutube.ru/play/embed/11318635";
            const expected = "https://bl.rutube.ru/route/" +
                                        "7fa99a98331d643cc44d4f529fba762a.m3u8";
            return extract(url).then(function (file) {
                assert.ok(file.startsWith(expected),
                          `"${file}".startsWith(expected)`);
            });
        });

        it("should return error when access isn't allowed", function () {
            const url = "https://rutube.ru/play/embed/7575145";
            const expected = "noVideo";
            return extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected),
                          `"${error.title}".includes(expected)`);
                assert.ok(error.message.includes(expected),
                          `"${error.message}".includes(expected)`);
            });
        });
    });
});
