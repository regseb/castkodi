import assert from "node:assert";
import { extract } from "../../../../src/core/scraper/melty.js";

describe("core/scraper/melty.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://www.melty.com/");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a video", async function () {
            const url = new URL("https://www.melty.fr/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script></script>
                        <script>window.__INITIAL_STATE__={
                            "articles": {
                                "items": []
                            }
                        };(function(){}());
                        </script>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return null when it's external video", async function () {
            const url = new URL("https://www.melty.fr/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script></script>
                        <script>window.__INITIAL_STATE__={
                            "articles": {
                                "items": [{
                                    "video": { "kind": "External" }
                                }]
                            }
                        };(function(){}());
                        </script>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return URL", async function () {
            const url = new URL("https://www.melty.fr/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script></script>
                        <script>window.__INITIAL_STATE__={
                            "articles": {
                                "items": [{
                                    "video": {
                                        "URL": "http://bar.com/baz.mp4",
                                        "kind": "Video"
                                    }
                                }]
                            }
                        };(function(){}());
                        </script>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file, "http://bar.com/baz.mp4");
        });
    });
});
