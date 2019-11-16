import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/stormotv.js";

describe("scraper/stormotv", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL",
                                                             async function () {
            const url = "https://www.stormo.tv/categories/sport/";

            const file = await extract(url);
            assert.strictEqual(file, url);
        });
    });

    describe("https://www.stormo.tv/videos/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a video", async function () {
            const url = "https://www.stormo.tv/videos/foo";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            const url = "https://www.stormo.tv/videos/514985" +
                                             "/little-big-rock-paper-scissors/";
            const expected = "/514000/514985/514985_low.mp4/";

            const file = await action(new URL(url));
            assert.ok(file.endsWith(expected), `"${file}".endsWith(expected)`);
        });
    });
});
