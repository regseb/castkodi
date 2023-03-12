/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Twitch", function () {
    it("should return video id", async function () {
        const url = new URL("https://www.twitch.tv/videos/164088111");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&video_id=164088111",
        );
    });

    it("should return video id when protocol is HTTP", async function () {
        const url = new URL("http://www.twitch.tv/videos/164088111");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&video_id=164088111",
        );
    });

    it("should return video id from 'go'", async function () {
        const url = new URL("https://go.twitch.tv/videos/164088111");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&video_id=164088111",
        );
    });

    it("should return video id from mobile version", async function () {
        const url = new URL("https://m.twitch.tv/videos/164088111");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&video_id=164088111",
        );
    });

    it("should return URL when it isn't a clip", async function () {
        const url = new URL("https://clips.twitch.tv/embed?noclip=Awesome");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, url.href);
    });

    it("should return embed clip name", async function () {
        const url = new URL(
            "https://clips.twitch.tv/embed" +
                "?clip=IncredulousAbstemiousFennelImGlitch",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/" +
                "?mode=play&slug=IncredulousAbstemiousFennelImGlitch",
        );
    });

    it("should return clip name", async function () {
        const url = new URL(
            "https://clips.twitch.tv/GleamingWildCougarFUNgineer",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/" +
                "?mode=play&slug=GleamingWildCougarFUNgineer",
        );
    });

    it("should return clip name when protocol is HTTP", async function () {
        const url = new URL(
            "http://clips.twitch.tv/GleamingWildCougarFUNgineer",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/" +
                "?mode=play&slug=GleamingWildCougarFUNgineer",
        );
    });

    it("should return clip name from channel", async function () {
        const url = new URL(
            "https://www.twitch.tv/twitch/clip/GleamingWildCougarFUNgineer" +
                "?filter=clips&range=7d&sort=time",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/" +
                "?mode=play&slug=GleamingWildCougarFUNgineer",
        );
    });

    it("should return clip name from 'go'", async function () {
        const url = new URL(
            "https://go.twitch.tv/twitch/clip/GleamingWildCougarFUNgineer",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/" +
                "?mode=play&slug=GleamingWildCougarFUNgineer",
        );
    });

    it("should return clip name from mobile version", async function () {
        const url = new URL(
            "https://m.twitch.tv/twitch/clip/GleamingWildCougarFUNgineer",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/" +
                "?mode=play&slug=GleamingWildCougarFUNgineer",
        );
    });

    it("should return URL when it isn't channel or video", async function () {
        const url = new URL("https://player.twitch.tv/?other=foobar");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, url.href);
    });

    it("should return channel name from player", async function () {
        const url = new URL(
            "https://player.twitch.tv/?channel=canardpc&muted=true",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&channel_name=canardpc",
        );
    });

    it("should return video id from player", async function () {
        const url = new URL(
            "https://player.twitch.tv/?video=474384559&autoplay=false",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&video_id=474384559",
        );
    });

    it("should return channel name from moderator URL", async function () {
        const url = new URL("https://www.twitch.tv/moderator/artefr");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&channel_name=artefr",
        );
    });

    it("should return channel name", async function () {
        const url = new URL("https://www.twitch.tv/nolife");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&channel_name=nolife",
        );
    });

    it("should return channel name when protocol is HTTP", async function () {
        const url = new URL("http://www.twitch.tv/nolife");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&channel_name=nolife",
        );
    });

    it("should return channel name from 'go'", async function () {
        const url = new URL("https://go.twitch.tv/nolife");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&channel_name=nolife",
        );
    });

    it("should return channel name from mobile version", async function () {
        const url = new URL("https://m.twitch.tv/jvtv");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.twitch/?mode=play&channel_name=jvtv",
        );
    });
});
