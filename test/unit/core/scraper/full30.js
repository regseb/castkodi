import assert      from "assert";
import { extract } from "../../../../src/core/scraper/full30.js";

describe("core/scraper/full30.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://www.full30.com/recently-added";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when there isn't noscript", async function () {
            const url = "https://www.full30.com/video/foo";
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

        it("should return video URL", async function () {
            const url = "http://www.full30.com/video/foo";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <div id="video-player">
                          <noscript>
                            <video>
                              <source src="https://foo.com/bar.mp4" />
                            </video>
                          </noscript>
                        </div>
                      </body>
                    </html>`, "text/html")),
            };
            const expected = "https://foo.com/bar.mp4";

            const file = await extract(new URL(url), content);
            assert.strictEqual(file, expected);
        });
    });
});
