import assert from "assert";
import { extractGame, extractBroadcast }
                                   from "../../../../src/core/scraper/steam.js";

describe("core/scraper/steam.js", function () {
    describe("extractGame()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://store.steampowered.com/stats/";
            const expected = null;

            const file = await extractGame(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not a video", async function () {
            const url = "https://store.steampowered.com/app/foo";
            const doc = new DOMParser().parseFromString(`
                <html>
                  <body></body>
                </html>`, "text/html");
            const expected = null;

            const file = await extractGame(new URL(url), doc);
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            const url = "https://store.steampowered.com/app/foo";
            const doc = new DOMParser().parseFromString(`
                <html>
                  <body>
                    <div class="highlight_movie"
                         data-mp4-hd-source="https://foo.com/bar.mp4"></div>
                  </body>
                </html>`, "text/html");
            const expected = "https://foo.com/bar.mp4";

            const file = await extractGame(new URL(url), doc);
            assert.strictEqual(file, expected);
        });
    });

    describe("extractBroadcast()", function () {
        it("should return null when it's not a video", async function () {
            const url = "https://steamcommunity.com/broadcast/watch/404";
            const expected = null;

            const file = await extractBroadcast(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            const url = "https://steamcommunity.com/broadcast/watch" +
                                                           "/76561198802066071";
            const expected = "https://cache4-lhr1.steamcontent.com/broadcast" +
                                                          "/76561198802066071/";

            const file = await extractBroadcast(new URL(url));
            assert.ok(file.startsWith(expected),
                      `"${file}".startsWith(expected)`);
        });

        it("should return video URL when protocol is HTTP", async function () {
            const url = "http://steamcommunity.com/broadcast/watch" +
                                                           "/76561198802066071";
            const expected = "https://cache4-lhr1.steamcontent.com/broadcast" +
                                                          "/76561198802066071/";

            const file = await extractBroadcast(new URL(url));
            assert.ok(file.startsWith(expected),
                      `"${file}".startsWith(expected)`);
        });
    });
});
