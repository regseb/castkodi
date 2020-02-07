import assert from "assert";
import sinon  from "sinon";
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
        afterEach(function () {
            sinon.restore();
        });

        it("should return null when it's not a video", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({ "json": () => ({}) }));

            const url = "https://steamcommunity.com/broadcast/watch/foo";
            const expected = null;

            const file = await extractBroadcast(new URL(url));
            assert.strictEqual(file, expected);
            const call = globalThis.fetch.firstCall;
            assert.strictEqual(call.args[0],
                               "https://steamcommunity.com/broadcast" +
                               "/getbroadcastmpd/?steamid=foo");
        });

        it("should return video URL", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({
                "json": () => ({ "hls_url": "https://bar.com/baz.mp4" })
            }));

            const url = "https://steamcommunity.com/broadcast/watch/foo";
            const expected = "https://bar.com/baz.mp4";

            const file = await extractBroadcast(new URL(url));
            assert.strictEqual(file, expected);
            const call = globalThis.fetch.firstCall;
            assert.strictEqual(call.args[0],
                               "https://steamcommunity.com/broadcast" +
                               "/getbroadcastmpd/?steamid=foo");
        });
    });
});
