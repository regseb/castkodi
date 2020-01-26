import assert      from "assert";
import { extract } from "../../../../src/core/scraper/iframe.js";

describe("core/scraper/iframe.js", function () {
    describe("extract()", function () {
        it("should return null when it's not a HTML page", async function () {
            const url = "https://example.com/not_html.zip";
            const doc = null;
            const options = { "depth": 0 };
            const expected = null;

            const file = await extract(new URL(url), doc, options);
            assert.strictEqual(file, expected);
        });

        it("should return null when depth is 1", async function () {
            const url = "https://example.com/index.html";
            const doc = new DOMParser().parseFromString(`
                <html>
                  <body>
                    <iframe src="https://www.youtube.com/embed/2lAe1cqCOXo" />
                  </body>
                </html>`, "text/html");
            const options = { "depth": 1 };
            const expected = null;

            const file = await extract(new URL(url), doc, options);
            assert.strictEqual(file, expected);
        });

        it("should return null when there isn't iframe", async function () {
            const url = "https://example.com/index.html";
            const doc = new DOMParser().parseFromString(`
                <html>
                  <body>
                  </body>
                </html>`, "text/html");
            const options = { "depth": 0 };
            const expected = null;

            const file = await extract(new URL(url), doc, options);
            assert.strictEqual(file, expected);
        });

        it("should return URL from iframe", async function () {
            const url = "https://example.com/index.html";
            const doc = new DOMParser().parseFromString(`
                <html>
                  <body>
                    <iframe src="https://www.youtube.com/embed/2lAe1cqCOXo" />
                  </body>
                </html>`, "text/html");
            const options = { "depth": 0, "incognito": true };
            const expected = "plugin://plugin.video.youtube/play/" +
                                                       "?video_id=2lAe1cqCOXo" +
                                                       "&incognito=true";

            const file = await extract(new URL(url), doc, options);
            assert.strictEqual(file, expected);
        });

        it("should return URL from second iframe", async function () {
            const url = "https://www.youtube.com/index.html";
            const doc = new DOMParser().parseFromString(`
                <html>
                  <body>
                    <iframe src="http://exemple.com/data.zip"></iframe>
                    <iframe src="/embed/YbJOTdZBX1g"></iframe>
                  </body>
                </html>`, "text/html");
            const options = { "depth": 0, "incognito": false };
            const expected = "plugin://plugin.video.youtube/play/" +
                                                       "?video_id=YbJOTdZBX1g" +
                                                       "&incognito=false";

            const file = await extract(new URL(url), doc, options);
            assert.strictEqual(file, expected);
        });
    });
});
