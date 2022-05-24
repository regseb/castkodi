import assert from "node:assert";
import sinon from "sinon";
import { kodi } from "../../../../src/core/kodi.js";
import * as scraper from "../../../../src/core/scraper/lepoint.js";

describe("core/scraper/lepoint.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("https://moncompte.lepoint.fr/");

            const file = await scraper.extract(url);
            assert.strictEqual(file, undefined);
        });

        it("should return undefined when it's not a video", async function () {
            const url = new URL("https://www.lepoint.fr/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };
            const options = { depth: false, incognito: false };

            const file = await scraper.extract(url, content, options);
            assert.strictEqual(file, undefined);
        });

        it("should return undefined when it's depther", async function () {
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

            const file = await scraper.extract(url, content, options);
            assert.strictEqual(file, undefined);
        });

        it("should return undefined when sub-page doesn't have media",
                                                             async function () {
            const url = new URL("https://www.lepoint.fr/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <div data-video-src="http://bar.com/"></div>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: false, incognito: false };

            const file = await scraper.extract(url, content, options);
            assert.strictEqual(file, undefined);
        });

        it("should return video URL", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

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

            const file = await scraper.extract(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/" +
                                               "?video_id=baz&incognito=false");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, ["video"]);
        });
    });
});
