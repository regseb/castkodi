import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/uqload.js";

describe("core/scraper/uqload.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("https://uqload.co/faq");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when no script", async function () {
            const url = new URL("https://uqload.co/foo.html");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.equal(file, undefined);
        });

        it("should return undefined when no inline script", async function () {
            const url = new URL("https://uqload.co/foo.html");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script src="https://uqload.co/script.js"></script>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.equal(file, undefined);
        });

        it("should return undefined when no sources", async function () {
            const url = new URL("https://uqload.co/foo.html");
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
            assert.equal(file, undefined);
        });

        it("should return video URL", async function () {
            const url = new URL("https://uqload.co/foo.html");
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
            assert.equal(file,
                "https://bar.com/baz/v.mp4|Referer=https://uqload.co/");
        });

        it("should return video URL from old TLD", async function () {
            const url = new URL("https://uqload.com/foo.html");
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
            assert.equal(file,
                "https://bar.com/baz/v.mp4|Referer=https://uqload.co/");
        });
    });
});
