import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/rutube.js";

describe("scraper/rutube", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL",
                                                             async function () {
            const url = "https://rutube.ru/index/hot/";

            const file = await extract(url);
            assert.strictEqual(file, url);
        });
    });

    describe("*://rutube.ru/video/*/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a video", async function () {
            const url = "https://rutube.ru/video/no_id/";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not a video with id",
                                                             async function () {
            const url = "https://rutube.ru/video/0a1b2c3d4e5/";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            const url = "https://rutube.ru/video" +
                                          "/c3290999478b6c11addf33b26f4ca81c/" +
                                                  "?pl_id=2664175&pl_type=user";
            const expected = "https://bl.rutube.ru/route" +
                                      "/c3290999478b6c11addf33b26f4ca81c.m3u8?";

            const file = await action(new URL(url));
            assert.ok(file.startsWith(expected),
                      `"${file}".startsWith(expected)`);
        });
    });

    describe("*://rutube.ru/play/embed/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when access isn't allowed", async function () {
            const url = "https://rutube.ru/play/embed/1";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            const url = "https://rutube.ru/play/embed/11318635";
            const expected = "https://bl.rutube.ru/route" +
                                      "/7fa99a98331d643cc44d4f529fba762a.m3u8?";

            const file = await action(new URL(url));
            assert.ok(file.startsWith(expected),
                      `"${file}".startsWith(expected)`);
        });

        it("should return video URL when protocol is HTTP ", async function () {
            const url = "http://rutube.ru/play/embed/11318635";
            const expected = "https://bl.rutube.ru/route" +
                                      "/7fa99a98331d643cc44d4f529fba762a.m3u8?";

            const file = await action(new URL(url));
            assert.ok(file.startsWith(expected),
                      `"${file}".startsWith(expected)`);
        });
    });
});
