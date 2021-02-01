import assert      from "assert";
import { extractEpisode, extractLive, extractMovie, extractMoviePage }
                                   from "../../../../src/core/scraper/vtmgo.js";

describe("core/scraper/vtmgo.js", function () {
    describe("extractEpisode()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://foo.be");

            const file = await extractEpisode(url);
            assert.strictEqual(file, null);
        });

        it("should return video URL when format is afspelen/<character><uuid>",
                                                             async function () {
            const url = new URL("http://www.vtm.be/vtmgo/" +
                              "afspelen/e97f7cf4a-1cb8-4564-a6e5-ee1f94052574");

            const file = await extractEpisode(url);
            assert.strictEqual(file,
                "plugin://plugin.video.vtm.go/play/catalog/" +
                               "episodes/97f7cf4a-1cb8-4564-a6e5-ee1f94052574");
        });

        it("should return video URL without 'www'", async function () {
            const url = new URL("http://vtm.be/vtmgo/" +
                              "afspelen/e97f7cf4a-1cb8-4564-a6e5-ee1f94052574");

            const file = await extractEpisode(url);
            assert.strictEqual(file,
                "plugin://plugin.video.vtm.go/play/catalog/" +
                               "episodes/97f7cf4a-1cb8-4564-a6e5-ee1f94052574");
        });
    });

    describe("extractMovie()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://foo.be");

            const file = await extractMovie(url);
            assert.strictEqual(file, null);
        });

        it("should return video URL when format is afspelen/<character><uuid>",
                                                             async function () {
            const url = new URL("http://www.vtm.be/vtmgo/" +
                              "afspelen/m97f7cf4a-1cb8-4564-a6e5-ee1f94052574");

            const file = await extractMovie(url);
            assert.strictEqual(file,
                "plugin://plugin.video.vtm.go/play/catalog/" +
                               "movies/97f7cf4a-1cb8-4564-a6e5-ee1f94052574");
        });

        it("should return video URL without 'www'", async function () {
            const url = new URL("http://vtm.be/vtmgo/" +
                              "afspelen/m97f7cf4a-1cb8-4564-a6e5-ee1f94052574");

            const file = await extractMovie(url);
            assert.strictEqual(file,
                "plugin://plugin.video.vtm.go/play/catalog/" +
                               "movies/97f7cf4a-1cb8-4564-a6e5-ee1f94052574");
        });
    });

    describe("extractMoviePage()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://foo.be");

            const file = await extractMoviePage(url);
            assert.strictEqual(file, null);
        });

        it("should return video URL when format is <name>~<character><uuid>",
                                                             async function () {
            const url = new URL("https://vtm.be/vtmgo/" +
                                   "foo~m97f7cf4a-1cb8-4564-a6e5-ee1f94052574");

            const file = await extractMoviePage(url);
            assert.strictEqual(file,
                "plugin://plugin.video.vtm.go/play/catalog/" +
                                 "movies/97f7cf4a-1cb8-4564-a6e5-ee1f94052574");
        });
    });

    describe("extractLive()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://foo.be");

            const file = await extractLive(url);
            assert.strictEqual(file, null);
        });

        it("should return null without fjs-player and url without id",
                                                             async function () {
            const url = new URL("https://vtm.be/vtmgo/live-kijken/vtm");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };

            const file = await extractLive(url, content);
            assert.strictEqual(file, null);
        });

        it("should return video URL from live content", async function () {
            const url = new URL("https://vtm.be/vtmgo/live-kijken/vtm3");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <div class="fjs-player" data-assettype="channel"
                                 data-id="d9a8ca31-850d-4536-87e8-d4928ce5ec6e">
                        </div>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await extractLive(url, content);
            assert.strictEqual(file,
                "plugin://plugin.video.vtm.go/play/catalog/" +
                               "channels/d9a8ca31-850d-4536-87e8-d4928ce5ec6e");
        });
    });
});
