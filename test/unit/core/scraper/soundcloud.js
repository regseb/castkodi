/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
import * as scraper from "../../../../src/core/scraper/soundcloud.js";

describe("core/scraper/soundcloud.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://developers.soundcloud.com/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return audio URL", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://soundcloud.com/foo/bar");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.audio.soundcloud/play/" +
                    "?url=https%3A%2F%2Fsoundcloud.com%2Ffoo%2Fbar",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, [
                "audio",
                "video",
            ]);
        });

        it("should return audio URL from mobile version", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://mobi.soundcloud.com/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.audio.soundcloud/play/" +
                    "?url=https%3A%2F%2Fsoundcloud.com%2Ffoo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, [
                "audio",
                "video",
            ]);
        });

        it("should return audio URL to soundcloud", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([
                    "plugin.audio.soundcloud",
                    "plugin.video.sendtokodi",
                ]),
            );

            const url = new URL("https://soundcloud.com/foo/bar");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.audio.soundcloud/play/" +
                    "?url=https%3A%2F%2Fsoundcloud.com%2Ffoo%2Fbar",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, [
                "audio",
                "video",
            ]);
        });

        it("should return audio URL to sendtokodi", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve(["plugin.video.sendtokodi"]),
            );

            const url = new URL("https://soundcloud.com/foo/bar");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/" +
                    "?https://soundcloud.com/foo/bar",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, [
                "audio",
                "video",
            ]);
        });
    });
});
