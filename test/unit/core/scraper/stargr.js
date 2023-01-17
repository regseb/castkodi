import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
import * as scraper from "../../../../src/core/scraper/stargr.js";

describe("core/scraper/stargr.js", function () {
    describe("extractTv()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("https://disney.fr/disney-plus-star");

            const file = await scraper.extractTv(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it's not a video", async function () {
            const url = new URL("https://www.star.gr/tv/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <div></div>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { incognito: false };

            const file = await scraper.extractTv(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return video URL", async function () {
            const url = new URL("https://www.star.gr/tv/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <div data-plugin-bitmovinv5="${JSON.stringify({
                            BitMovin: {
                                ConfigUrl: "https://baz.gr/manifest.m3u8",
                            },
                        }).replaceAll(`"`, "&quot;")}"></div>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { incognito: false };

            const file = await scraper.extractTv(url, content, options);
            assert.equal(file, "https://baz.gr/manifest.m3u8");
        });
    });

    describe("extractVideo()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("https://disney.fr/disney-plus-star");

            const file = await scraper.extractVideo(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it's not a video", async function () {
            const url = new URL("https://www.star.gr/video/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <iframe></iframe>
                        <script></script>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: false, incognito: false };

            const file = await scraper.extractVideo(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return undefined when it's depth", async function () {
            const spy = sinon.spy(kodi.addons, "getAddons");

            const url = new URL("https://www.star.gr/video/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <!-- Coller le "style" et la "src" car c'est le cas dans
                             les pages de StarGR. -->
                        <iframe id="yt-player"
                                style=""src="https://www.youtube.com/embed/bar"
                          ></iframe>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: true, incognito: false };

            const file = await scraper.extractVideo(url, content, options);
            assert.equal(file, undefined);

            assert.equal(spy.callCount, 0);
        });

        it("should return undefined when sub-page doesn't have media",
                                                             async function () {
            const url = new URL("https://www.star.gr/video/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <!-- Coller le "style" et la "src" car c'est le cas dans
                             les pages de StarGR. -->
                        <iframe id="yt-player"
                                style=""src="https://www.youtube.com/"></iframe>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: false, incognito: false };

            const file = await scraper.extractVideo(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return video YouTube id", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://www.star.gr/video/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <!-- Coller le "style" et la "src" car c'est le cas dans
                             les pages de StarGR. -->
                        <iframe id="yt-player"
                                style=""src="https://www.youtube.com/embed/bar"
                          ></iframe>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: false, incognito: false };

            const file = await scraper.extractVideo(url, content, options);
            assert.equal(file,
                "plugin://plugin.video.youtube/play/" +
                                               "?video_id=bar&incognito=false");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video URL", async function () {
            const url = new URL("https://www.star.gr/video/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script>
                            // ...
                            source: [{
                                name: 'Bar',
                                type: 'hls',
                                url: 'https://baz.gr/qux/quux/manifest.m3u8'
                            }],
                            // ...
                        </script>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: false, incognito: false };

            const file = await scraper.extractVideo(url, content, options);
            assert.equal(file, "https://baz.gr/qux/quux/manifest.m3u8");
        });
    });
});
