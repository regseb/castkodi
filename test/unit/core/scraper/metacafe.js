import assert      from "assert";
import { extract } from "../../../../src/core/scraper/metacafe.js";

describe("core/scraper/metacafe.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://www.metacafe.com/galleries/foo");
            const content = undefined;

            const file = await extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const url = new URL("https://www.metacafe.com/watch/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script id="json_video_data">
                            {
                                "sources": [{
                                    "src": "https://bar.com/baz.mp4"
                                }]
                            }
                        </script>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file, "https://bar.com/baz.mp4");
        });
    });
});
