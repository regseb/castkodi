import assert from "node:assert";
import * as scraper from "../../../../src/core/scraper/applepodcasts.js";

describe("core/scraper/applepodcasts.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("https://podcasts.apple.com/us/artist" +
                                                             "/arte-radio/foo");

            const file = await scraper.extract(url);
            assert.strictEqual(file, undefined);
        });

        it("should return undefined when it's not an audio", async function () {
            const url = new URL("https://podcasts.apple.com/us/podcast/foo/id");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, undefined);
        });

        it("should return audio URL", async function () {
            const url = new URL("https://podcasts.apple.com/fr/podcast/foo" +
                                                                      "/idbar");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script id="shoebox-media-api-cache-amp-podcasts">
                            {
                                "baz": "${JSON.stringify({
                                    d: [{
                                        attributes: {
                                            assetUrl: "http://qux.fr/quux.mp3",
                                        },
                                    }],
                                }).replaceAll(`"`, `\\"`)}"
                            }
                        </script>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, "http://qux.fr/quux.mp3");
        });
    });
});
