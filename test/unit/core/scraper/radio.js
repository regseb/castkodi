import assert      from "assert";
import { extract } from "../../../../src/core/scraper/radio.js";

describe("core/scraper/radio.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://www.radio.net/top-stations");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when no script", async function () {
            const url = new URL("https://www.radio.net/s/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return null when no inline script", async function () {
            const url = new URL("https://www.radio.net/s/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script src="https://www.radio.net/script.js"></script>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return null when no station", async function () {
            const url = new URL("https://www.radio.net/s/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script>
                          var require = {
                              'components/station/stationService': {}
                          };
                        </script>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return audio URL", async function () {
            const url = new URL("https://www.radio.net/s/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script>
                          var require = {
                              'components/station/stationService': {
                                  station: ${JSON.stringify({
                                      streams: [{
                                          url: "https://bar.io/baz.mp3",
                                      }],
                                  })},
                                  nowPlayingPollingInterval: 60000
                              }
                          };
                        </script>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file, "https://bar.io/baz.mp3");
        });
    });
});
