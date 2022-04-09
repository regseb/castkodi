import assert from "node:assert";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/goplay.js";

describe("core/scraper/goplay.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("https://www.goplay.be/profiel");

            const file = await scraper.extract(url);
            assert.strictEqual(file, undefined);
        });

        it("should return undefined when it's not a video", async function () {
            const url = new URL("https://www.goplay.be/video/foo");
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
                JSON.stringify({ path: "http://foo.be/bar.mp4" }),
            ));

            const url = new URL("https://www.goplay.be/video/baz");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <div data-video="${JSON.stringify({
                            id: "qux",
                        }).replaceAll(`"`, "&quot;")}"></div>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, "http://foo.be/bar.mp4");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.goplay.be/api/video/qux",
            ]);
        });
    });
});
