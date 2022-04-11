import assert from "node:assert";
import * as scraper from "../../../../src/core/scraper/reddit.js";

describe("core/scraper/reddit.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("https://www.reddit.com/");

            const file = await scraper.extract(url);
            assert.strictEqual(file, undefined);
        });

        it("should return undefined when it's not a video", async function () {
            const url = new URL("https://www.redditmedia.com/mediaembed/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, undefined);
        });

        it("should return video URL", async function () {
            const url = new URL("https://www.redditmedia.com/mediaembed/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <div data-hls-url="https://bar.com/baz.m3u8" />
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, "https://bar.com/baz.m3u8");
        });
    });
});
