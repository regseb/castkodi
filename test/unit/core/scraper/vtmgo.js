/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/vtmgo.js";

describe("core/scraper/vtmgo.js", function () {
    describe("extractEpisode()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://foo.be");

            const file = await scraper.extractEpisode(url);
            assert.equal(file, undefined);
        });

        it("should return video UUID", async function () {
            const url = new URL("http://vtm.be/vtmgo/afspelen/efoo");

            const file = await scraper.extractEpisode(url);
            assert.equal(
                file,
                "plugin://plugin.video.vtm.go/play/catalog/episodes/foo",
            );
        });

        it("should return video UUID with 'www'", async function () {
            const url = new URL("http://www.vtm.be/vtmgo/afspelen/efoo");

            const file = await scraper.extractEpisode(url);
            assert.equal(
                file,
                "plugin://plugin.video.vtm.go/play/catalog/episodes/foo",
            );
        });
    });

    describe("extractMovie()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://foo.be");

            const file = await scraper.extractMovie(url);
            assert.equal(file, undefined);
        });

        it("should return video UUID", async function () {
            const url = new URL("http://vtm.be/vtmgo/afspelen/mfoo");

            const file = await scraper.extractMovie(url);
            assert.equal(
                file,
                "plugin://plugin.video.vtm.go/play/catalog/movies/foo",
            );
        });

        it("should return video UUID with 'www'", async function () {
            const url = new URL("http://www.vtm.be/vtmgo/afspelen/mfoo");

            const file = await scraper.extractMovie(url);
            assert.equal(
                file,
                "plugin://plugin.video.vtm.go/play/catalog/movies/foo",
            );
        });
    });

    describe("extractMoviePage()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://foo.be");

            const file = await scraper.extractMoviePage(url);
            assert.equal(file, undefined);
        });

        it("should return video UUID", async function () {
            const url = new URL("https://vtm.be/vtmgo/foo~mbar");

            const file = await scraper.extractMoviePage(url);
            assert.equal(
                file,
                "plugin://plugin.video.vtm.go/play/catalog/movies/bar",
            );
        });

        it("should return video UUID with 'www'", async function () {
            const url = new URL("https://www.vtm.be/vtmgo/foo~mbar");

            const file = await scraper.extractMoviePage(url);
            assert.equal(
                file,
                "plugin://plugin.video.vtm.go/play/catalog/movies/bar",
            );
        });
    });

    describe("extractChannel()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://foo.be");

            const file = await scraper.extractChannel(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when no player", async function () {
            const url = new URL("https://vtm.be/vtmgo/live-kijken/foo");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            "<html><body></body></html>",
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractChannel(url, content);
            assert.equal(file, undefined);
        });

        it("should return video UUID", async function () {
            const url = new URL("https://vtm.be/vtmgo/live-kijken/foo");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <div class="fjs-player" data-id="bar"></div>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractChannel(url, content);
            assert.equal(
                file,
                "plugin://plugin.video.vtm.go/play/catalog/channels/bar",
            );
        });
    });
});
