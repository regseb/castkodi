import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/radio.js";

describe("core/scraper/radio.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("https://www.radio.net/top-stations");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when no station", async function () {
            const url = new URL("https://www.radio.net/s/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script id="__NEXT_DATA__">${JSON.stringify({
                            props: { pageProps: { data: {} } },
                        })}</script>
                        <script>
                          var require = {
                              'components/station/stationService': {}
                          };
                        </script>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.equal(file, undefined);
        });

        it("should return audio URL", async function () {
            const url = new URL("https://www.radio.net/s/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script id="__NEXT_DATA__">${JSON.stringify({
                            props: {
                                pageProps: {
                                    data: {
                                        broadcast: {
                                            streams: [{
                                                url: "https://bar.net/baz.mp3",
                                            }, {
                                                url: "https://qux.net/quux.mp3",
                                            }],
                                        },
                                    },
                                },
                            },
                        })}</script>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.equal(file, "https://bar.net/baz.mp3");
        });
    });
});
