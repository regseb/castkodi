import assert from "node:assert";
import { extract } from "../../../../src/core/scraper/aparat.js";

describe("core/scraper/aparat.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://www.aparat.com/result/foo");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a video", async function () {
            const url = new URL("https://www.aparat.com/v/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const url = new URL("https://www.aparat.com/v/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <div class="download-dropdown">
                          <ul>
                            <li><a href="http://bar.com/"></a></li>
                            <li><a href="http://baz.com/"></a></li>
                          </ul>
                        </div>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file, "http://baz.com/");
        });
    });
});
