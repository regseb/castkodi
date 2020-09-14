import assert      from "assert";
import { extract } from "../../../../src/core/scraper/futurasciences.js";

describe("core/scraper/futurasciences.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://cdn.futura-sciences.com/");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a HTML page", async function () {
            const url = new URL("https://www.futura-sciences.com/favicon.png");
            const content = { html: () => Promise.resolve(null) };
            const options = { depth: false };

            const file = await extract(url, content, options);
            assert.strictEqual(file, null);
        });

        it("should return null when there isn't iframe", async function () {
            const url = new URL("https://www.futura-sciences.com/foo");
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

        it("should return URL from iframe", async function () {
            const url = new URL("https://www.futura-sciences.com/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <iframe data-src="//dai.ly/bar"></iframe>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: false, incognito: true };

            const file = await extract(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.dailymotion_com/" +
                                                     "?mode=playVideo&url=bar");
        });

        it("should return URL from iframe with data-src", async function () {
            const url = new URL("https://www.futura-sciences.com/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <iframe src="//dai.ly/bar"></iframe>
                        <iframe data-src="http://baz.com/qux.zip"></iframe>
                        <iframe data-src="//dai.ly/quux"></iframe>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: false, incognito: false };

            const file = await extract(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.dailymotion_com/" +
                                                    "?mode=playVideo&url=quux");
        });

        it("should return URL from vsly-player", async function () {
            const url = new URL("https://www.futura-sciences.com/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <div class="vsly-player"
                             data-iframe="//dai.ly/bar"></div>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: false, incognito: true };

            const file = await extract(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.dailymotion_com/" +
                                                     "?mode=playVideo&url=bar");
        });
    });
});
