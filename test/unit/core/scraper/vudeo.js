import assert from "node:assert";
import * as scraper from "../../../../src/core/scraper/vudeo.js";

describe("core/scraper/vudeo.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("https://vudeo.io/faq");

            const file = await scraper.extract(url);
            assert.strictEqual(file, undefined);
        });

        it("should return undefined when no script", async function () {
            const url = new URL("https://vudeo.io/foo.html");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, undefined);
        });

        it("should return undefined when no inline script", async function () {
            const url = new URL("https://vudeo.io/foo.html");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script src="https://vudeo.io/script.js"></script>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, undefined);
        });

        it("should return undefined when no sources", async function () {
            const url = new URL("https://vudeo.io/foo.html");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script>
                            var player = new Clappr.Player({});
                        </script>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, undefined);
        });

        it("should return video URL", async function () {
            const url = new URL("https://vudeo.io/foo.html");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script>
                            var player = new Clappr.Player({
                                sources: ["https://bar.com/baz/v.mp4"], 
                            });
                        </script>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file,
                "https://bar.com/baz/v.mp4|Referer=https://vudeo.io/");
        });
    });
});
