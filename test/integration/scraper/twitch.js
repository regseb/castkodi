/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Twitch", function () {
    it("should return video id", async function () {
        const url = new URL("https://www.twitch.tv/videos/164088111");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&video_id=164088111",
        );
    });

    it("should return video id from 'go'", async function () {
        const url = new URL("https://go.twitch.tv/videos/164088111");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&video_id=164088111",
        );
    });

    it("should return video id from mobile version", async function () {
        const url = new URL("https://m.twitch.tv/videos/164088111");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&video_id=164088111",
        );
    });

    it("should return embed clip slug", async function () {
        const url = new URL(
            "https://clips.twitch.tv/embed" +
                "?clip=IncredulousAbstemiousFennelImGlitch",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/" +
                "?mode=play&slug=IncredulousAbstemiousFennelImGlitch",
        );
    });

    it("should return clip slug", async function () {
        const url = new URL(
            "https://clips.twitch.tv/GleamingWildCougarFUNgineer",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/" +
                "?mode=play&slug=GleamingWildCougarFUNgineer",
        );
    });

    it("should return clip slug from channel", async function () {
        const url = new URL(
            "https://www.twitch.tv/twitch/clip/GleamingWildCougarFUNgineer" +
                "?filter=clips&range=7d&sort=time",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/" +
                "?mode=play&slug=GleamingWildCougarFUNgineer",
        );
    });

    it("should return clip slug from 'go'", async function () {
        const url = new URL(
            "https://go.twitch.tv/twitch/clip/GleamingWildCougarFUNgineer",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/" +
                "?mode=play&slug=GleamingWildCougarFUNgineer",
        );
    });

    it("should return clip slug from mobile version", async function () {
        const url = new URL(
            "https://m.twitch.tv/twitch/clip/GleamingWildCougarFUNgineer",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/" +
                "?mode=play&slug=GleamingWildCougarFUNgineer",
        );
    });

    it("should return undefined when it isn't channel or video", async function () {
        const url = new URL("https://player.twitch.tv/?other=foobar");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return channel name from player", async function () {
        const url = new URL(
            "https://player.twitch.tv/?channel=canardpc&muted=true",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&channel_name=canardpc",
        );
    });

    it("should return video id from player", async function () {
        const url = new URL(
            "https://player.twitch.tv/?video=474384559&autoplay=false",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&video_id=474384559",
        );
    });

    it("should return channel name from moderator URL", async function () {
        const url = new URL("https://www.twitch.tv/moderator/artefr");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&channel_name=artefr",
        );
    });

    it("should return channel name", async function () {
        const url = new URL("https://www.twitch.tv/nolife");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&channel_name=nolife",
        );
    });

    it("should return channel name from 'go'", async function () {
        const url = new URL("https://go.twitch.tv/nolife");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&channel_name=nolife",
        );
    });

    it("should return channel name from mobile version", async function () {
        const url = new URL("https://m.twitch.tv/jvtv");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&channel_name=jvtv",
        );
    });
});
