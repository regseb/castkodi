import assert from "node:assert";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/jv.js";

describe("core/scraper/jv.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("https://www.jvlemag.com/");

            const file = await scraper.extract(url);
            assert.strictEqual(file, undefined);
        });

        it("should return undefined when it's not a video", async function () {
            const url = new URL("https://www.jeuxvideo.com/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, undefined);
        });

        it("should return video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({ options: { video: "foo" } }),
            ));

            const url = new URL("https://www.jeuxvideo.com/bar");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <div data-src-video="/baz/qux.php"></div>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo" +
                                                      "&url=foo");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                new URL("https://www.jeuxvideo.com/baz/qux.php"),
            ]);
        });
    });
});
