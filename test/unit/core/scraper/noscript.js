import assert from "node:assert";
import { extract } from "../../../../src/core/scraper/noscript.js";

describe("core/scraper/noscript.js", function () {
    describe("extract()", function () {
        it("should return null when it's not a HTML page", async function () {
            const url = new URL("https://foo.com/bar.zip");
            const content = { html: () => Promise.resolve(null) };
            const options = { depth: false };

            const file = await extract(url, content, options);
            assert.strictEqual(file, null);
        });

        it("should return null when there isn't noscript", async function () {
            const url = new URL("https://foo.com/bar.html");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };
            const options = { depth: false };

            const file = await extract(url, content, options);
            assert.strictEqual(file, null);
        });

        it("should return null when noscript is empty", async function () {
            const url = new URL("https://foo.com/bar.html");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body><noscript></noscript></body>
                    </html>`, "text/html")),
            };
            const options = { depth: false };

            const file = await extract(url, content, options);
            assert.strictEqual(file, null);
        });

        it("should return URL from video in noscript", async function () {
            const url = new URL("https://foo.com/bar.html");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <noscript>
                          <video src="https://baz.org/qux.mp4" />
                        </noscript>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: false, incognito: true };

            const file = await extract(url, content, options);
            assert.strictEqual(file, "https://baz.org/qux.mp4");
        });

        it("should return URL from second noscript", async function () {
            const url = new URL("https://foo.com/bar.html");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <noscript>
                          <a href="http://baz.org/">link</a>
                        </noscript>
                        <noscript>
                          <audio src="https://qux.org/quxx.mp3" />
                        </noscript>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: false, incognito: false };

            const file = await extract(url, content, options);
            assert.strictEqual(file, "https://qux.org/quxx.mp3");
        });
    });
});
