/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
import * as scraper from "../../../../src/core/scraper/twitch.js";

describe("core/scraper/twitch.js", function () {
    describe("extractClip()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://appeals.twitch.tv/");

            const file = await scraper.extractClip(url);
            assert.equal(file, undefined);
        });

        it("should return embed clip slug", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://clips.twitch.tv/embed?clip=foo");

            const file = await scraper.extractClip(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&slug=foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return undefined when it isn't a clip", async function () {
            const url = new URL("https://clips.twitch.tv/embed?noclip=foo");

            const file = await scraper.extractClip(url);
            assert.equal(file, undefined);
        });

        it("should return clip slug", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://clips.twitch.tv/foo");

            const file = await scraper.extractClip(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&slug=foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });
    });

    describe("extractEmbed()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://clips.twitch.tv/");

            const file = await scraper.extractEmbed(url);
            assert.equal(file, undefined);
        });

        it("should return channel name", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://player.twitch.tv/?channel=foo");

            const file = await scraper.extractEmbed(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video id", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://player.twitch.tv/?video=foo");

            const file = await scraper.extractEmbed(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&video_id=foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return undefined when it isn't channel or video", async function () {
            const url = new URL("https://player.twitch.tv/?other=foo");

            const file = await scraper.extractEmbed(url);
            assert.equal(file, undefined);
        });
    });

    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://app.twitch.tv/download");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return video id", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://www.twitch.tv/videos/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&video_id=foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video id from 'go'", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://go.twitch.tv/videos/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&video_id=foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video id from mobile version", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://m.twitch.tv/videos/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&video_id=foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video id to twitch", async function () {
            const stub = sinon
                .stub(kodi.addons, "getAddons")
                .resolves(["plugin.video.twitch", "plugin.video.sendtokodi"]);

            const url = new URL("https://www.twitch.tv/videos/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&video_id=foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video URL to sendtokodi", async function () {
            const stub = sinon
                .stub(kodi.addons, "getAddons")
                .resolves(["plugin.video.sendtokodi"]);

            const url = new URL("https://www.twitch.tv/videos/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/" +
                    "?https://www.twitch.tv/videos/foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return clip slug", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://www.twitch.tv/foo/clip/bar");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&slug=bar",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return clip slug from 'go'", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://go.twitch.tv/foo/clip/bar");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&slug=bar",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return clip slug from mobile version", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://m.twitch.tv/foo/clip/bar");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&slug=bar",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return clip slug to twitch", async function () {
            const stub = sinon
                .stub(kodi.addons, "getAddons")
                .resolves(["plugin.video.twitch", "plugin.video.sendtokodi"]);

            const url = new URL("https://www.twitch.tv/foo/clip/bar");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&slug=bar",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return clip URL to sendtokodi", async function () {
            const stub = sinon
                .stub(kodi.addons, "getAddons")
                .resolves(["plugin.video.sendtokodi"]);

            const url = new URL("https://www.twitch.tv/foo/clip/bar");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/?https://clips.twitch.tv/bar",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return channel name from moderator URL", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://www.twitch.tv/moderator/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return channel name", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://www.twitch.tv/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return channel name from 'go'", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://go.twitch.tv/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return channel name from mobile version", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://m.twitch.tv/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return channel name to twitch", async function () {
            const stub = sinon
                .stub(kodi.addons, "getAddons")
                .resolves(["plugin.video.twitch", "plugin.video.sendtokodi"]);

            const url = new URL("https://www.twitch.tv/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return channel URL to sendtokodi", async function () {
            const stub = sinon
                .stub(kodi.addons, "getAddons")
                .resolves(["plugin.video.sendtokodi"]);

            const url = new URL("https://www.twitch.tv/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/?https://www.twitch.tv/foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });
    });
});
