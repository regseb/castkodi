import assert from "node:assert";
import * as scraper from "../../../../src/core/scraper/tiktok.js";

describe("core/scraper/tiktok.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://www.tictac.com/");

            const file = await scraper.extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a video", async function () {
            const url = new URL("https://www.tiktok.com/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head>
                        <meta property="og:title" content="bar" />
                      </head>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const url = new URL("https://www.tiktok.com/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head>
                        <meta property="og:video:secure_url"
                              content="https://bar.com/baz.mp4" />
                      </head>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file,
                "https://bar.com/baz.mp4|Referer=https://www.tiktok.com/");
        });
    });
});
