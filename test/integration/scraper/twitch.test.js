/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("Scraper: Twitch", () => {
    it("should return video id", async () => {
        const url = new URL("https://www.twitch.tv/videos/164088111");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&video_id=164088111",
        );
    });

    it("should return video id from 'go'", async () => {
        const url = new URL("https://go.twitch.tv/videos/164088111");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&video_id=164088111",
        );
    });

    it("should return video id from mobile version", async () => {
        const url = new URL("https://m.twitch.tv/videos/164088111");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&video_id=164088111",
        );
    });

    it("should return embed clip slug", async () => {
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

    it("should return clip slug", async () => {
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

    it("should return clip slug from channel", async () => {
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

    it("should return clip slug from 'go'", async () => {
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

    it("should return clip slug from mobile version", async () => {
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

    it("should return undefined when it isn't channel or video", async () => {
        const url = new URL("https://player.twitch.tv/?other=foobar");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return channel name from player", async () => {
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

    it("should return video id from player", async () => {
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

    it("should return channel name from moderator URL", async () => {
        const url = new URL("https://www.twitch.tv/moderator/artefr");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&channel_name=artefr",
        );
    });

    it("should return channel name", async () => {
        const url = new URL("https://www.twitch.tv/nolife");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&channel_name=nolife",
        );
    });

    it("should return channel name from 'go'", async () => {
        const url = new URL("https://go.twitch.tv/nolife");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&channel_name=nolife",
        );
    });

    it("should return channel name from mobile version", async () => {
        const url = new URL("https://m.twitch.tv/jvtv");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&channel_name=jvtv",
        );
    });
});
