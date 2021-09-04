import assert from "node:assert";
import * as scraper from "../../../../src/core/scraper/videoshub.js";

describe("core/scraper/videoshub.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://videoshub.com/");
            const content = undefined;

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return null when it isn't a HTML page", async function () {
            const url = new URL("https://videoshub.com/videos/");
            const content = { html: () => Promise.resolve(null) };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return null when it isn't a video page", async function () {
            const url = new URL("https://videoshub.com/videos/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script></script>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, null);
        });
        it("should return video URL", async function () {
            const url = new URL("https://videoshub.com/videos/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script>
                            if (Hls.isSupported()) {
                                hls.loadSource('https://bar.com/baz.m3u8');
                            }
                        </script>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, "https://bar.com/baz.m3u8");
        });
    });
});
