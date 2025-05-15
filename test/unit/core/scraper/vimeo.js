/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
import * as scraper from "../../../../src/core/scraper/vimeo.js";

describe("core/scraper/vimeo.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://vimeo.com/channels");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return video id", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://player.vimeo.com/video/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.vimeo/play/?video_id=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id with hash", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://player.vimeo.com/video/foo?h=bar");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.vimeo/play/?video_id=foo:bar",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id to vimeo", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([
                    "plugin.video.sendtokodi",
                    "plugin.video.vimeo",
                ]),
            );

            const url = new URL("https://player.vimeo.com/video/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.vimeo/play/?video_id=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id with hash to vimeo", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([
                    "plugin.video.sendtokodi",
                    "plugin.video.vimeo",
                ]),
            );

            const url = new URL("https://player.vimeo.com/video/foo?h=bar");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.vimeo/play/?video_id=foo:bar",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id to sendtokodi", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve(["plugin.video.sendtokodi"]),
            );

            const url = new URL("https://player.vimeo.com/video/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/?https://vimeo.com/foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id with hash to sendtokodi", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve(["plugin.video.sendtokodi"]),
            );

            const url = new URL("https://player.vimeo.com/video/foo?h=bar");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/?https://vimeo.com/foo/bar",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });
});
