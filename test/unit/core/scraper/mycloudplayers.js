import assert from "node:assert";
import { extract } from "../../../../src/core/scraper/mycloudplayers.js";

describe("core/scraper/mycloudplayers.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            // Enlever le 's' de fin du nom de domaine.
            const url = new URL("http://mycloudplayer.com/");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when it's not an audio", async function () {
            const url = new URL("https://mycloudplayers.com/?featured=foo");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return audio id", async function () {
            const url = new URL("https://mycloudplayers.com/?play=12345");

            const file = await extract(url);
            assert.strictEqual(file,
                "plugin://plugin.audio.soundcloud/play/?audio_id=12345");
        });

        it("should return audio id when protocol is HTTP", async function () {
            const url = new URL("http://mycloudplayers.com/?play=00000");

            const file = await extract(url);
            assert.strictEqual(file,
                "plugin://plugin.audio.soundcloud/play/?audio_id=00000");
        });
    });
});
