import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/soundcloud.js";

describe("scraper/soundcloud", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL",
                                                             async function () {
            const url = "https://soundcloud.com/stream";

            const file = await extract(url);
            assert.strictEqual(file, url);
        });
    });

    describe("*://soundcloud.com/*/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not an audio", async function () {
            const url = "https://soundcloud.com/a-tribe-called-red" +
                                                            "/sets/trapline-ep";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not an audio with one slash",
                                                             async function () {
            const url = "https://soundcloud.com/you/collection";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return audio id", async function () {
            const url = "https://soundcloud.com/esa/a-singing-comet";
            const expected = "plugin://plugin.audio.soundcloud/play/" +
                                                          "?track_id=176387011";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return audio id when protocol is HTTP", async function () {
            const url = "http://soundcloud.com/esa/a-singing-comet";
            const expected = "plugin://plugin.audio.soundcloud/play/" +
                                                          "?track_id=176387011";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://mobi.soundcloud.com/*/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return audio id", async function () {
            const url = "https://mobi.soundcloud.com" +
                                    "/a-tribe-called-red/electric-pow-wow-drum";
            const expected = "plugin://plugin.audio.soundcloud/play/" +
                                                            "?track_id=8481452";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
