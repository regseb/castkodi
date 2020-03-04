import assert      from "assert";
import { extract } from "../../../../src/core/scraper/devtube.js";

describe("core/scraper/devtube.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://dev.tube/@codingandrey";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video id", async function () {
            const url = "https://dev.tube/video/4rWypxBwrR4";
            const doc = undefined;
            const options = { incognito: false };
            const expected = "plugin://plugin.video.youtube/play/" +
                                                       "?video_id=4rWypxBwrR4" +
                                                       "&incognito=false";

            const file = await extract(new URL(url), doc, options);
            assert.strictEqual(file, expected);
        });
    });
});
