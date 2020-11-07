import assert      from "assert";
import { extract } from "../../../../src/core/scraper/tiktok.js";

describe("core/scraper/tiktok.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://www.tictac.com/");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a video", async function () {
            const url = new URL("https://www.tiktok.com/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script id="__NEXT_DATA__">${JSON.stringify({
                            props: { pageProps: {} },
                        })}</script>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const url = new URL("https://www.tiktok.com/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script id="__NEXT_DATA__">${JSON.stringify({
                            props: {
                                pageProps: {
                                    itemInfo: {
                                        itemStruct: {
                                            video: {
                                                playAddr: "https://bar.com" +
                                                                     "/baz.mp4",
                                            },
                                        },
                                    },
                                },
                            },
                        })}</script>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file, "https://bar.com/baz.mp4");
        });
    });
});
