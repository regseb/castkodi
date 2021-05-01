import assert from "node:assert";
import { extract } from "../../../../src/core/scraper/allocine.js";

describe("core/scraper/allocine.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://secure.allocine.fr/account");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a video", async function () {
            const url = new URL("https://www.allocine.fr/foo");
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
            const url = new URL("https://www.allocine.fr/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <figure data-model="${JSON.stringify({
                            videos: [{
                                sources: { sd: "/bar.avi", hd: "/baz.mp4" },
                            }],
                        }).replaceAll(`"`, "&quot;")}"></figure>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file, "https://www.allocine.fr/baz.mp4");
        });
    });
});
