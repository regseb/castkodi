import assert      from "assert";
import { extract } from "../../../../src/core/scraper/bigo.js";

describe("core/scraper/bigo.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://www.bigo.sg/";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not a video", async function () {
            const url = "https://www.bigo.tv/foo";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script></script>
                      </body>
                    </html>`, "text/html")),
            };
            const expected = null;

            const file = await extract(new URL(url), content);
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            const url = "http://www.bigo.tv/foo";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script>
                          var CONFIG = {
                              videoSrc: "http://bar.tv/baz.m3u8",
                              qux: "quux"
                          }];
                        </script>
                      </body>
                    </html>`, "text/html")),
            };
            const expected = "http://bar.tv/baz.m3u8";

            const file = await extract(new URL(url), content);
            assert.strictEqual(file, expected);
        });
    });
});
