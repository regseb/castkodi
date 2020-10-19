import assert from "assert";
import { extractPlayer, extractPlaylist }
                               from "../../../../src/core/scraper/megaphone.js";

describe("core/scraper/megaphone.js", function () {
    describe("extractPlayer()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://megaphone.fm/");

            const file = await extractPlayer(url);
            assert.strictEqual(file, null);
        });

        it("should return audio", async function () {
            const url = new URL("https://player.megaphone.fm/foo");

            const file = await extractPlayer(url);
            assert.strictEqual(file, "https://dcs.megaphone.fm/foo.mp3");
        });
    });

    describe("extractPlaylist()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://megaphone.fm/");

            const file = await extractPlaylist(url);
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a audio", async function () {
            const url = new URL("https://playlist.megaphone.fm/foo");

            const file = await extractPlaylist(url);
            assert.strictEqual(file, null);
        });

        it("should return audio", async function () {
            const url = new URL("https://playlist.megaphone.fm/?e=foo");

            const file = await extractPlaylist(url);
            assert.strictEqual(file, "https://dcs.megaphone.fm/foo.mp3");
        });
    });
});
