/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
import * as scraper from "../../../../src/core/scraper/vrtnu.js";

describe("core/scraper/vrtnu.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.vrt.be/vrtnu/livestream");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return video URL", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.vrt.be/vrtnu/a-z/foo/");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.vrt.nu/play/url" +
                    "/https://www.vrt.be/vrtnu/a-z/foo/",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video URL when protocol is HTTP", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("http://www.vrt.be/vrtnu/a-z/foo/");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.vrt.nu/play/url" +
                    "/http://www.vrt.be/vrtnu/a-z/foo/",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video URL without 'www'", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://vrt.be/vrtnu/a-z/foo/");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.vrt.nu/play/url" +
                    "/https://vrt.be/vrtnu/a-z/foo/",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video URL from 'link' page", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://vrtnu.page.link/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.vrt.nu/play/url" +
                    "/https://vrtnu.page.link/foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video URL to vrtnu", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([
                    "plugin.video.vrt.nu",
                    "plugin.video.sendtokodi",
                ]),
            );

            const url = new URL("https://www.vrt.be/vrtnu/a-z/foo/");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.vrt.nu/play/url" +
                    "/https://www.vrt.be/vrtnu/a-z/foo/",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video URL to sendtokodi", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve(["plugin.video.sendtokodi"]),
            );

            const url = new URL("https://www.vrt.be/vrtnu/a-z/foo/");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/" +
                    "?https://www.vrt.be/vrtnu/a-z/foo/",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });
});
