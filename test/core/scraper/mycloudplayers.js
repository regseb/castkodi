import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/mycloudplayers.js";

describe("scraper/mycloudplayers", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL",
                                                             async function () {
            // Enlever le 's' de fin du nom de domaine.
            const url = "http://mycloudplayer.com/";

            const file = await extract(url);
            assert.strictEqual(file, url);
        });
    });

    describe("*://mycloudplayers.com/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not an audio", async function () {
            const url = "https://mycloudplayers.com/?featured=tracks";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return audio id", async function () {
            const url = "https://mycloudplayers.com/?play=176387011";
            const expected = "plugin://plugin.audio.soundcloud/play/" +
                                                          "?audio_id=176387011";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return audio id when protocol is HTTP", async function () {
            const url = "http://mycloudplayers.com/?play=176387011";
            const expected = "plugin://plugin.audio.soundcloud/play/" +
                                                          "?audio_id=176387011";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
