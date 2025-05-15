/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
import * as scraper from "../../../../src/core/scraper/vtmgo.js";

describe("core/scraper/vtmgo.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extractEpisode()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://foo.be");

            const file = await scraper.extractEpisode(url);
            assert.equal(file, undefined);
        });

        it("should return episode UUID", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.vtmgo.be/vtmgo/afspelen/efoo");

            const file = await scraper.extractEpisode(url);
            assert.equal(
                file,
                "plugin://plugin.video.vtm.go/play/catalog/episodes/foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return episode UUID to vtmgo", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([
                    "plugin.video.vtm.go",
                    "plugin.video.sendtokodi",
                ]),
            );

            const url = new URL("https://www.vtmgo.be/vtmgo/afspelen/efoo");

            const file = await scraper.extractEpisode(url);
            assert.equal(
                file,
                "plugin://plugin.video.vtm.go/play/catalog/episodes/foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return episode UUID to sendtokodi", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve(["plugin.video.sendtokodi"]),
            );

            const url = new URL("https://www.vtmgo.be/vtmgo/afspelen/efoo");

            const file = await scraper.extractEpisode(url);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/" +
                    "?https://www.vtmgo.be/vtmgo/afspelen/efoo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });

    describe("extractMovie()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://foo.be");

            const file = await scraper.extractMovie(url);
            assert.equal(file, undefined);
        });

        it("should return movie UUID", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.vtmgo.be/vtmgo/afspelen/mfoo");

            const file = await scraper.extractMovie(url);
            assert.equal(
                file,
                "plugin://plugin.video.vtm.go/play/catalog/movies/foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return movie UUID to vtmgo", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([
                    "plugin.video.vtm.go",
                    "plugin.video.sendtokodi",
                ]),
            );

            const url = new URL("https://www.vtmgo.be/vtmgo/afspelen/mfoo");

            const file = await scraper.extractMovie(url);
            assert.equal(
                file,
                "plugin://plugin.video.vtm.go/play/catalog/movies/foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return movie UUID to sendtokodi", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve(["plugin.video.sendtokodi"]),
            );

            const url = new URL("https://www.vtmgo.be/vtmgo/afspelen/mfoo");

            const file = await scraper.extractMovie(url);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/" +
                    "?https://www.vtmgo.be/vtmgo/afspelen/mfoo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });

    describe("extractMoviePage()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://foo.be");

            const file = await scraper.extractMoviePage(url);
            assert.equal(file, undefined);
        });

        it("should return movie UUID", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.vtmgo.be/vtmgo/foo~mbar");

            const file = await scraper.extractMoviePage(url);
            assert.equal(
                file,
                "plugin://plugin.video.vtm.go/play/catalog/movies/bar",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });

    describe("extractChannel()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://foo.be");

            const file = await scraper.extractChannel(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when no player", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons");

            const url = new URL("https://www.vtmgo.be/vtmgo/live-kijken/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            '<html lang="en"><body></body></html>',
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractChannel(url, metadata);
            assert.equal(file, undefined);

            assert.equal(getAddons.mock.callCount(), 0);
        });

        it("should return channel UUID", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.vtmgo.be/vtmgo/live-kijken/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <div class="fjs-player" data-id="bar"></div>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractChannel(url, metadata);
            assert.equal(
                file,
                "plugin://plugin.video.vtm.go/play/catalog/channels/bar",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return channel UUID to vtmgo", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([
                    "plugin.video.vtm.go",
                    "plugin.video.sendtokodi",
                ]),
            );

            const url = new URL("https://www.vtmgo.be/vtmgo/live-kijken/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <div class="fjs-player" data-id="bar"></div>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractChannel(url, metadata);
            assert.equal(
                file,
                "plugin://plugin.video.vtm.go/play/catalog/channels/bar",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return channel UUID to sendtokodi", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve(["plugin.video.sendtokodi"]),
            );

            const url = new URL("https://www.vtmgo.be/vtmgo/live-kijken/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <div class="fjs-player" data-id="bar"></div>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractChannel(url, metadata);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/" +
                    "?https://www.vtmgo.be/vtmgo/live-kijken/bar",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });
});
