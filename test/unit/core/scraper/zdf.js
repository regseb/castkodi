import assert from "node:assert";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/zdf.js";

describe("core/scraper/zdf.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("https://www.zdftext.de/");

            const file = await scraper.extract(url);
            assert.strictEqual(file, undefined);
        });

        it("should return undefined when it's not a video", async function () {
            const url = new URL("https://www.zdf.de/foo");
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
                JSON.stringify({
                    priorityList: [{
                        formitaeten: [{
                            qualities: [{
                                audio: {
                                    tracks: [{
                                        uri: "https://foo.de/bar.webm",
                                    }],
                                },
                            }],
                        }],
                    }],
                }),
            ));

            const url = new URL("https://www.zdf.de/baz");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <button class="download-btn"
                                data-dialog="${JSON.stringify({
                            contentUrl: "http://qux.de/{playerId}/quux.json",
                            apiToken:   "corge",
                        }).replaceAll(`"`, "&quot;")}"></button>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, "https://foo.de/bar.webm");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "http://qux.de/ngplayer_2_4/quux.json",
                { headers: { "Api-Auth": "Bearer corge" } },
            ]);
        });
    });
});
