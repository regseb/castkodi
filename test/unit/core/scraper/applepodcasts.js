import assert      from "assert";
import { extract } from "../../../../src/core/scraper/applepodcasts.js";

describe("core/scraper/applepodcasts.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://podcasts.apple.com/us/artist" +
                                                      "/arte-radio/1251092473");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when it's not an audio", async function () {
            const url = new URL("https://podcasts.apple.com/us/podcast/foo/id");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return audio URL", async function () {
            const url = new URL("https://podcasts.apple.com/fr/podcast/foo" +
                                                                      "/id123");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script id="shoebox-ember-data-store">
                            {
                                "123456789": {
                                    "data": {
                                        "attributes": {
                                            "assetUrl": "https://foo.fr/bar.mp3"
                                        }
                                    }
                                }
                            }
                        </script>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file, "https://foo.fr/bar.mp3");
        });
    });
});
