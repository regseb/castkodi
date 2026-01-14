/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as scraper from "../../../../src/core/scraper/megaphone.js";
import "../../setup.js";

describe("core/scraper/megaphone.js", () => {
    describe("extractPlayer()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://megaphone.fm/");

            const file = await scraper.extractPlayer(url);
            assert.equal(file, undefined);
        });

        it("should return audio", async () => {
            const url = new URL("https://player.megaphone.fm/foo");

            const file = await scraper.extractPlayer(url);
            assert.equal(file, "https://dcs.megaphone.fm/foo.mp3");
        });
    });

    describe("extractPlaylist()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://megaphone.fm/");

            const file = await scraper.extractPlaylist(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a audio", async () => {
            const url = new URL("https://playlist.megaphone.fm/foo");

            const file = await scraper.extractPlaylist(url);
            assert.equal(file, undefined);
        });

        it("should return audio", async () => {
            const url = new URL("https://playlist.megaphone.fm/?e=foo");

            const file = await scraper.extractPlaylist(url);
            assert.equal(file, "https://dcs.megaphone.fm/foo.mp3");
        });
    });
});
