import assert      from "assert";
import { extract } from "../../../../src/core/scraper/onetv.js";

describe("core/scraper/onetv.js", function () {
    describe("extract()", function () {
        it("should return null when there isn't Open Graph", async function () {
            const url = "https://www.1tv.ru/foo.html";
            const doc = new DOMParser().parseFromString(`
                <html>
                  <head></head>
                </html>`, "text/html");
            const expected = null;

            const file = await extract(new URL(url), doc);
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            const url = "https://www.1tv.ru/foo.html";
            const doc = new DOMParser().parseFromString(`
                <html>
                  <head>
                    <meta property="og:video:url"
                          content="http://bar.com/baz.mp4" />
                  </head>
                </html>`, "text/html");
            const expected = "http://bar.com/baz.mp4";

            const file = await extract(new URL(url), doc);
            assert.strictEqual(file, expected);
        });
    });
});
