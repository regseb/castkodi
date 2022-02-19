import assert from "node:assert";
import * as scraper from "../../../../src/core/scraper/melty.js";

describe("core/scraper/melty.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://www.melty.com/");

            const file = await scraper.extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when it's depth", async function () {
            const url = new URL("https://www.melty.fr/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <meta itemprop="contentUrl"
                              content="http://www.dailymotion.com/embed/video` +
                                                                       `/bar" />
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: true };

            const file = await scraper.extract(url, content, options);
            assert.strictEqual(file, null);
        });

        it("should return null when there isn't video", async function () {
            const url = new URL("https://www.melty.fr/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head>
                        <meta name="description" content="bar" />
                      </head>
                    </html>`, "text/html")),
            };
            const options = { depth: false };

            const file = await scraper.extract(url, content, options);
            assert.strictEqual(file, null);
        });

        it("should return URL", async function () {
            const url = new URL("https://www.melty.fr/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <meta itemprop="contentUrl"
                              content="http://www.dailymotion.com/embed/video` +
                                                                       `/bar" />
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: false };

            const file = await scraper.extract(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo" +
                                                      "&url=bar");
        });
    });
});
