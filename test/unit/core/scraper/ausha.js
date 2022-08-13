import assert from "node:assert";
import * as scraper from "../../../../src/core/scraper/ausha.js";

describe("core/scraper/ausha.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("https://www.ausha.co/fr/");

            const file = await scraper.extract(url);
            assert.strictEqual(file, undefined);
        });

        it("should return undefined when it's not an audio", async function () {
            const url = new URL("https://podcast.ausha.co/foo/bar");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, undefined);
        });

        it("should return audio URL", async function () {
            const url = new URL("https://podcast.ausha.co/foo/bar");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <a href="https://audio.ausha.co/baz.mp3">Qux</a>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, "https://audio.ausha.co/baz.mp3");
        });
    });
});
