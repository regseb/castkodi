import assert from "node:assert";
import * as scraper from "../../../../src/core/scraper/stargr.js";

describe("core/scraper/stargr.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://disney.fr/disney-plus-star");

            const file = await scraper.extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a video", async function () {
            const url = new URL("https://www.star.gr/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script></script>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { incognito: false };

            const file = await scraper.extract(url, content, options);
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const url = new URL("https://www.star.gr/foo");
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
            const options = { incognito: false };

            const file = await scraper.extract(url, content, options);
            assert.strictEqual(file, "https://baz.gr/qux/quux/manifest.m3u8");
        });

        it("should return video YouTube id", async function () {
            const url = new URL("https://www.star.gr/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script>
                            // ...
                            player = new YT.Player('revideoplayer', {
                                height: '100%',
                                width: '100%',
                                videoId: 'bar',
                                events: {
                                    'onStateChange': onPlayerStateChange
                                }
                            });
                            // ...
                        </script>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { incognito: false };

            const file = await scraper.extract(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/?video_id=bar" +
                                                   "&incognito=false");
        });
    });
});
