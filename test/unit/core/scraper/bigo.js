import assert      from "assert";
import { extract } from "../../../../src/core/scraper/bigo.js";

describe("core/scraper/bigo.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://www.bigo.sg/";

            const file = await extract(new URL(url));
            assert.strictEqual(file, null);
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

            const file = await extract(new URL(url), content);
            assert.strictEqual(file, null);
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

            const file = await extract(new URL(url), content);
            assert.strictEqual(file, "http://bar.tv/baz.m3u8");
        });
    });
});
