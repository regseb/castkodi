import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/scrapers.js";
import { rules }   from "../../../src/core/scraper/mycloudplayers.js";

describe("scraper/mycloudplayers", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            // Enlever le 's' de fin du nom de domaine.
            const url = "http://mycloudplayer.com/";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://mycloudplayers.com/*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a music", function () {
            const url = "https://mycloudplayers.com/?featured=tracks";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return music id", function () {
            const url = "https://mycloudplayers.com/?play=176387011";
            const expected = "plugin://plugin.audio.soundcloud/play/" +
                                                          "?audio_id=176387011";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return music id when protocol is HTTP", function () {
            const url = "http://mycloudplayers.com/?play=176387011";
            const expected = "plugin://plugin.audio.soundcloud/play/" +
                                                          "?audio_id=176387011";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
