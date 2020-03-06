import assert      from "assert";
import { extract } from "../../../../src/core/scraper/video.js";

describe("core/scraper/video.js", function () {
    describe("extract()", function () {
        it("should return null when it's not a HTML page", async function () {
            const url = "https://foo.com";
            const content = { html: () => Promise.resolve(null) };
            const expected = null;

            const file = await extract(new URL(url), content);
            assert.strictEqual(file, expected);
        });

        it("should return null when there isn't video", async function () {
            const url = "https://foo.com";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };
            const expected = null;

            const file = await extract(new URL(url), content);
            assert.strictEqual(file, expected);
        });

        it("should return null when source is empty", async function () {
            const url = "https://foo.com";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <video src="" />
                      </body>
                    </html>`, "text/html")),
            };
            const expected = null;

            const file = await extract(new URL(url), content);
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            const url = "https://foo.com";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <video src="/bar.mp4" />
                      </body>
                    </html>`, "text/html")),
            };
            const expected = "https://foo.com/bar.mp4";

            const file = await extract(new URL(url), content);
            assert.strictEqual(file, expected);
        });
    });
});
