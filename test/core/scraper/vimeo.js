import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/vimeo.js";

describe("scraper/vimeo", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL",
                                                             async function () {
            const url = "https://developer.vimeo.com/";

            const file = await extract(url);
            assert.strictEqual(file, url);
        });
    });

    describe("*://vimeo.com/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a video", async function () {
            const url = "https://vimeo.com/channels";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video id", async function () {
            const url = "https://vimeo.com/228786490";
            const expected = "plugin://plugin.video.vimeo/play/" +
                                                          "?video_id=228786490";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video id when protocol is HTTP", async function () {
            const url = "http://vimeo.com/228786490";
            const expected = "plugin://plugin.video.vimeo/play/" +
                                                          "?video_id=228786490";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://player.vimeo.com/video/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a video", async function () {
            const url = "https://player.vimeo.com/video/foobar";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video id", async function () {
            const url = "https://player.vimeo.com/video/228786490";
            const expected = "plugin://plugin.video.vimeo/play/" +
                                                          "?video_id=228786490";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
