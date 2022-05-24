import assert from "node:assert";
import * as scraper from "../../../../src/core/scraper/tiktok.js";

describe("core/scraper/tiktok.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("https://www.tictac.com/");

            const file = await scraper.extract(url);
            assert.strictEqual(file, undefined);
        });

        it("should return undefined when there isn't data", async function () {
            const url = new URL("https://www.tiktok.com/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, undefined);
        });

        it("should return undefined when it's not a video", async function () {
            const url = new URL("https://www.tiktok.com/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script id="SIGI_STATE">${JSON.stringify({
                            AppContext: {},
                        })}</script>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, undefined);
        });

        it("should return video URL", async function () {
            const url = new URL("https://www.tiktok.com/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script id="SIGI_STATE">${JSON.stringify({
                            AppContext: {},
                            ItemModule: [{
                                video: { playAddr: "https://bar.com/baz.mp4" },
                            }],
                        })}</script>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, "https://bar.com/baz.mp4");
        });
    });
});
