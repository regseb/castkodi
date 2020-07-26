import assert from "assert";
import sinon  from "sinon";
import { extractGame, extractBroadcast }
                                   from "../../../../src/core/scraper/steam.js";

describe("core/scraper/steam.js", function () {
    describe("extractGame()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://store.steampowered.com/stats/");

            const file = await extractGame(url);
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a video", async function () {
            const url = new URL("https://store.steampowered.com/app/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };

            const file = await extractGame(url, content);
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const url = new URL("https://store.steampowered.com/app/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <div class="highlight_movie"
                             data-mp4-hd-source="https://foo.com/bar.mp4"></div>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await extractGame(url, content);
            assert.strictEqual(file, "https://foo.com/bar.mp4");
        });
    });

    describe("extractBroadcast()", function () {
        it("should return null when it's not a video", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({}),
            ));

            const url = new URL("https://steamcommunity.com/broadcast/watch" +
                                                                        "/foo");

            const file = await extractBroadcast(url);
            assert.strictEqual(file, null);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://steamcommunity.com/broadcast/getbroadcastmpd/" +
                "?steamid=foo",
            ]);

            stub.restore();
        });

        it("should return video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                // eslint-disable-next-line camelcase
                JSON.stringify({ hls_url: "https://bar.com/baz.mp4" }),
            ));

            const url = new URL("https://steamcommunity.com/broadcast/watch" +
                                                                        "/foo");

            const file = await extractBroadcast(url);
            assert.strictEqual(file, "https://bar.com/baz.mp4");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://steamcommunity.com/broadcast/getbroadcastmpd/" +
                "?steamid=foo",
            ]);

            stub.restore();
        });
    });
});
