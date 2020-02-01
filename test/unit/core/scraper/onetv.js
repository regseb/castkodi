import assert      from "assert";
import { extract } from "../../../../src/core/scraper/onetv.js";

describe("core/scraper/onetv.js", function () {
    describe("extract()", function () {
        it("should return null when there isn't Open Graph", async function () {
            const url = "https://www.1tv.ru/foo.html";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            const url = "https://www.1tv.ru/embed/157535:12";
            const expected = "https://balancer-vod.1tv.ru/video/multibitrate" +
                                                           "/video/2019/12/30" +
                                       "/9186df7c-9677-45e6-8de3-3f8bee109338" +
                                        "_HD-news-2020_01_01-23_28_05_3800.mp4";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
