/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/megaphone.js";

describe("core/scraper/megaphone.js", function () {
    describe("extractPlayer()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://megaphone.fm/");

            const file = await scraper.extractPlayer(url);
            assert.equal(file, undefined);
        });

        it("should return audio", async function () {
            const url = new URL("https://player.megaphone.fm/foo");

            const file = await scraper.extractPlayer(url);
            assert.equal(file, "https://dcs.megaphone.fm/foo.mp3");
        });
    });

    describe("extractPlaylist()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://megaphone.fm/");

            const file = await scraper.extractPlaylist(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a audio", async function () {
            const url = new URL("https://playlist.megaphone.fm/foo");

            const file = await scraper.extractPlaylist(url);
            assert.equal(file, undefined);
        });

        it("should return audio", async function () {
            const url = new URL("https://playlist.megaphone.fm/?e=foo");

            const file = await scraper.extractPlaylist(url);
            assert.equal(file, "https://dcs.megaphone.fm/foo.mp3");
        });
    });
});
