import assert      from "assert";
import { extract } from "../../../../src/core/scraper/applepodcasts.js";

describe("core/scraper/applepodcasts.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://podcasts.apple.com/us/artist/arte-radio" +
                                                                  "/1251092473";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not an audio", async function () {
            const url = "https://podcasts.apple.com/us/podcast/foo/id";
            const doc = new DOMParser().parseFromString(`
                <html>
                  <body></body>
                </html>`, "text/html");
            const expected = null;

            const file = await extract(new URL(url), doc);
            assert.strictEqual(file, expected);
        });

        it("should return audio URL", async function () {
            const url = "https://podcasts.apple.com/fr/podcast/foo/id123";
            const doc = new DOMParser().parseFromString(`
                <html>
                  <body>
                    <script id="shoebox-ember-data-store">
                        {
                            "data": {
                                "attributes": {
                                    "assetUrl": "https://foo.com/bar.mp3"
                                }
                            }
                        }
                    </script>
                  </body>
                </html>`, "text/html");
            const expected = "https://foo.com/bar.mp3";

            const file = await extract(new URL(url), doc);
            assert.strictEqual(file, expected);
        });
    });
});
