import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/devtube.js";

describe("scraper/devtube", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL",
                                                             async function () {
            const url = "https://dev.tube/@codingandrey";

            const file = await extract(url);
            assert.strictEqual(file, url);
        });
    });

    describe("*://dev.tube/video/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return video id", async function () {
            const url = "https://dev.tube/video/4rWypxBwrR4";
            const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=4rWypxBwrR4";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
