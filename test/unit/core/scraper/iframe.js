import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/iframe.js";

describe("core/scraper/iframe.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's not a HTML page",
                                                             async function () {
            const url = new URL("https://foo.com/bar.zip");
            const content = { html: () => Promise.resolve(undefined) };
            const options = { depth: false };

            const file = await scraper.extract(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return undefined when it's depth", async function () {
            const url = new URL("https://foo.com/bar.html");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <iframe src="https://www.youtube.com/embed/baz"
                          ></iframe>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: true };

            const file = await scraper.extract(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't iframe",
                                                             async function () {
            const url = new URL("https://foo.com/bar.html");
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

        it("should return URL from iframe", async function () {
            const url = new URL("https://foo.com/bar.html");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <iframe src="https://www.dailymotion.com/embed/video` +
                                    `/baz"></iframe>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: false, incognito: true };

            const file = await scraper.extract(url, content, options);
            assert.equal(file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo" +
                                                      "&url=baz");
        });

        it("should return URL from second iframe", async function () {
            const url = new URL("https://www.dailymotion.com/index.html");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <iframe src="http://exemple.com/data.zip"></iframe>
                        <iframe src="/embed/video/foo"></iframe>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: false, incognito: false };

            const file = await scraper.extract(url, content, options);
            assert.equal(file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo" +
                                                      "&url=foo");
        });
    });
});
