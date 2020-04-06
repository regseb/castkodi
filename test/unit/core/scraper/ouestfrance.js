import assert      from "assert";
import { extract } from "../../../../src/core/scraper/ouestfrance.js";

describe("core/scraper/ouestfrance.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://www.sud-france.fr/foo";

            const file = await extract(new URL(url));
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a HTML page", async function () {
            const url = "https://www.ouest-france.fr/foo";
            const content = { html: () => Promise.resolve(null) };
            const options = { depth: 0 };

            const file = await extract(new URL(url), content, options);
            assert.strictEqual(file, null);
        });

        it("should return null when depth is 1", async function () {
            const url = "https://www.ouest-france.fr/foo";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <iframe data-ofiframe-src="https://www.youtube.com` +
                                                                 `/embed/foo" />
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: 1 };

            const file = await extract(new URL(url), content, options);
            assert.strictEqual(file, null);
        });

        it("should return null when no iframe", async function () {
            const url = "https://www.ouest-france.fr/foo";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };
            const options = { depth: 0 };

            const file = await extract(new URL(url), content, options);
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const url = "https://www.ouest-france.fr/foo";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <iframe data-ofiframe-src="//www.dailymotion.com` +
                                                           `/video/123456789" />
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: 0 };

            const file = await extract(new URL(url), content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.dailymotion_com/" +
                                               "?mode=playVideo&url=123456789");
        });
    });
});
