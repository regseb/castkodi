import assert from "node:assert";
import * as scraper from "../../../../src/core/scraper/video.js";

describe("core/scraper/video.js", function () {
    describe("extract()", function () {
        it("should return null when it's not a HTML page", async function () {
            const url = new URL("https://foo.com");
            const content = { html: () => Promise.resolve(null) };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return null when there isn't video", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return null when source is empty", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <video src="" />
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <video src="/bar.mp4" />
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, "https://foo.com/bar.mp4");
        });
    });
});
