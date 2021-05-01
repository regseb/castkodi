import assert from "node:assert";
import { extract } from "../../../../src/core/scraper/lepoint.js";

describe("core/scraper/lepoint.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://moncompte.lepoint.fr/");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a video", async function () {
            const url = new URL("https://www.lepoint.fr/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };
            const options = { depth: false, incognito: false };

            const file = await extract(url, content, options);
            assert.strictEqual(file, null);
        });

        it("should return null when it's depther", async function () {
            const url = new URL("https://www.lepoint.fr/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <div data-video-src="https://www.youtube.com/embed/baz">
                                                                          </div>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: true, incognito: false };

            const file = await extract(url, content, options);
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const url = new URL("https://www.lepoint.fr/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <div data-video-src="https://www.youtube.com/embed/baz">
                                                                          </div>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: false, incognito: false };

            const file = await extract(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/?video_id=baz" +
                                                            "&incognito=false");
        });
    });
});
