import assert      from "assert";
import { extract } from "../../../../src/core/scraper/allocine.js";

describe("core/scraper/allocine.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://secure.allocine.fr/account");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a video", async function () {
            const url = new URL("http://www.allocine.fr/foo");
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
            const url = new URL("http://www.allocine.fr/video/video-19577157/");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <figure data-model="${JSON.stringify({
                            videos: [{
                                sources: { sd: "/foo.avi", hd: "/bar.mp4" },
                            }],
                        }).replace(/"/gu, "&quot;")}"></figure>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file, "http://www.allocine.fr/bar.mp4");
        });
    });
});
