import assert      from "assert";
import { extract } from "../../../../src/core/scraper/vtmgo.js";

describe("core/scraper/vtmgo.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://foo.be");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null with an unsupported vtm URL and bad contents"
            , async function () {
            const url = new URL("https://vtm.be/vtmgo/" +
                                   "foo~p97f7cf4a-1cb8-4564-a6e5-ee1f94052574");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a HTML page and url without id",
            async function () {
            const url = new URL("https://vtm.be/vtmgo/live-kijken/vtm2");
            const content = { html: () => Promise.resolve(null) };

            const file = await extract(url, content);
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

            const file = await extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return null when id is not set", async function () {
            const url = new URL("https://vtm.be/vtmgo/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <div class="fjs-player" data-assettype="">
                        </div>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return null when assettype is empty", async function () {
            const url = new URL("https://vtm.be/vtmgo/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <div class="fjs-player" data-assettype=""
                                 data-id="d9a8ca31-850d-4536-87e8-d4928ce5ec6e">
                        </div>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return video URL from episodes content", async function () {
            const url = new URL("https://vtm.be/vtmgo/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <div class="fjs-player" data-assettype="episodes"
                                 data-id="d9a8ca31-850d-4536-87e8-d4928ce5ec6e">
                        </div>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file,
                "plugin://plugin.video.vtm.go/play/catalog/" +
                               "episodes/d9a8ca31-850d-4536-87e8-d4928ce5ec6e");
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

            const file = await extract(url, content);
            assert.strictEqual(file,
                "plugin://plugin.video.vtm.go/play/catalog/" +
                               "channels/d9a8ca31-850d-4536-87e8-d4928ce5ec6e");
        });

        it("should return video URL when format is afspelen/<character><uuid>"
            , async function () {
            const url = new URL("https://www.vtm.be/vtmgo/" +
                              "afspelen/e97f7cf4a-1cb8-4564-a6e5-ee1f94052574");

            const file = await extract(url);
            assert.strictEqual(file,
                "plugin://plugin.video.vtm.go/play/catalog/" +
                               "episodes/97f7cf4a-1cb8-4564-a6e5-ee1f94052574");
        });

        it("should return video URL when format is <name>~<character><uuid>"
            , async function () {
            const url = new URL("https://vtm.be/vtmgo/" +
                                   "foo~m97f7cf4a-1cb8-4564-a6e5-ee1f94052574");

            const file = await extract(url);
            assert.strictEqual(file,
                "plugin://plugin.video.vtm.go/play/catalog/" +
                                 "movies/97f7cf4a-1cb8-4564-a6e5-ee1f94052574");
        });

        it("should return video URL when protocol is HTTP", async function () {
            const url = new URL("http://www.vtm.be/vtmgo/" +
                              "afspelen/e97f7cf4a-1cb8-4564-a6e5-ee1f94052574");

            const file = await extract(url);
            assert.strictEqual(file,
                "plugin://plugin.video.vtm.go/play/catalog/" +
                               "episodes/97f7cf4a-1cb8-4564-a6e5-ee1f94052574");
        });

        it("should return video URL without 'www'", async function () {
            const url = new URL("http://vtm.be/vtmgo/" +
                              "afspelen/e97f7cf4a-1cb8-4564-a6e5-ee1f94052574");

            const file = await extract(url);
            assert.strictEqual(file,
                "plugin://plugin.video.vtm.go/play/catalog/" +
                               "episodes/97f7cf4a-1cb8-4564-a6e5-ee1f94052574");
        });
    });
});
