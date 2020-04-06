import assert      from "assert";
import { extract } from "../../../../src/core/scraper/mycloudplayers.js";

describe("core/scraper/mycloudplayers.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            // Enlever le 's' de fin du nom de domaine.
            const url = "http://mycloudplayer.com/";

            const file = await extract(new URL(url));
            assert.strictEqual(file, null);
        });

        it("should return null when it's not an audio", async function () {
            const url = "https://mycloudplayers.com/?featured=tracks";

            const file = await extract(new URL(url));
            assert.strictEqual(file, null);
        });

        it("should return audio id", async function () {
            const url = "https://mycloudplayers.com/?play=176387011";

            const file = await extract(new URL(url));
            assert.strictEqual(file,
                "plugin://plugin.audio.soundcloud/play/?audio_id=176387011");
        });

        it("should return audio id when protocol is HTTP", async function () {
            const url = "http://mycloudplayers.com/?play=176387011";

            const file = await extract(new URL(url));
            assert.strictEqual(file,
                "plugin://plugin.audio.soundcloud/play/?audio_id=176387011");
        });
    });
});
