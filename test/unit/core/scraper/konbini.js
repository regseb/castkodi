import assert      from "assert";
import { extract } from "../../../../src/core/scraper/konbini.js";

describe("core/scraper/metacafe.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://display.konbini.com/";

            const file = await extract(new URL(url));
            assert.strictEqual(file, null);
        });

        it("should return null when there isn't video", async function () {
            const url = "https://www.konbini.com/foo";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script id="__NEXT_DATA__">
                            {
                                "props": {
                                    "initialState": {
                                        "posts": {
                                            "entities": {
                                                "qux": {
                                                    "content": []
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        </script>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { incognito: false };

            const file = await extract(new URL(url), content, options);
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const url = "https://www.konbini.com/foo";
            const elements = [
                {
                    tagName: "p",
                }, {
                    tagName: "iframe",
                    value:   `<iframe src="https://bar.fr/"></iframe>`,
                }, {
                    tagName: "iframe",
                    value:   `<iframe src="https://www.youtube.com/embed/baz"` +
                                                                   `></iframe>`,
                },
            ];
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script id="__NEXT_DATA__">
                            {
                                "props": {
                                    "initialState": {
                                        "posts": {
                                            "entities": {
                                                "qux": {
                                                    "content": ` +
                                                    JSON.stringify(elements) + `
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        </script>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { incognito: false };

            const file = await extract(new URL(url), content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/?video_id=baz" +
                                                   "&incognito=false");
        });
    });
});
