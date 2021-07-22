import assert from "node:assert";
import * as scraper from "../../../../src/core/scraper/audio.js";

describe("core/scraper/audio.js", function () {
    describe("extract()", function () {
        it("should return null when it's not a HTML page", async function () {
            const url = new URL("https://foo.com");
            const content = { html: () => Promise.resolve(null) };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return null when there isn't audio", async function () {
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
                        <audio src="" />
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return audio URL", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <audio src="/bar.mp3" />
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, "https://foo.com/bar.mp3");
        });
    });
});
