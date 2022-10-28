import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/ouestfrance.js";

describe("core/scraper/ouestfrance.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("https://www.sud-france.fr/foo");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it's not a HTML page",
                                                             async function () {
            const url = new URL("https://www.ouest-france.fr/foo");
            const content = { html: () => Promise.resolve(undefined) };
            const options = { depth: false };

            const file = await scraper.extract(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return undefined when it's depth", async function () {
            const url = new URL("https://www.ouest-france.fr/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <iframe data-ofiframe-src="https://www.youtube.com` +
                                                          `/embed/bar"></iframe>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: true };

            const file = await scraper.extract(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return undefined when no iframe", async function () {
            const url = new URL("https://www.ouest-france.fr/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };
            const options = { depth: false };

            const file = await scraper.extract(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return undefined with iframe no video", async function () {
            const url = new URL("https://www.ouest-france.fr/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <iframe data-ofiframe-src="//bar.com/"></iframe>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: false };

            const file = await scraper.extract(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return video URL", async function () {
            const url = new URL("https://www.ouest-france.fr/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <iframe data-ofiframe-src="//bar.com/"></iframe>
                        <iframe data-ofiframe-src="//www.dailymotion.com` +
                                                          `/video/baz"></iframe>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: false };

            const file = await scraper.extract(url, content, options);
            assert.equal(file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo" +
                                                      "&url=baz");
        });
    });
});
