import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/soundcloud.js";

describe("scraper/soundcloud", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://soundcloud.com/stream";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://soundcloud.com/*/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not an audio", function () {
            const url = "https://soundcloud.com/a-tribe-called-red" +
                                                            "/sets/trapline-ep";
            const expected = null;

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not an audio with one slash",
                                                                   function () {
            const url = "https://soundcloud.com/you/collection";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return audio id", function () {
            const url = "https://soundcloud.com/esa/a-singing-comet";
            const expected = "plugin://plugin.audio.soundcloud/play/" +
                                                          "?track_id=176387011";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return audio id when protocol is HTTP", function () {
            const url = "http://soundcloud.com/esa/a-singing-comet";
            const expected = "plugin://plugin.audio.soundcloud/play/" +
                                                          "?track_id=176387011";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://mobi.soundcloud.com/*/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return audio id", function () {
            const url = "https://mobi.soundcloud.com" +
                                    "/a-tribe-called-red/electric-pow-wow-drum";
            const expected = "plugin://plugin.audio.soundcloud/play/" +
                                                            "?track_id=8481452";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
