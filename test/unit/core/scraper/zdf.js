import assert from "node:assert";
import sinon from "sinon";
import { extract } from "../../../../src/core/scraper/zdf.js";

describe("core/scraper/zdf.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://www.zdftext.de/");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a video", async function () {
            const url = new URL("https://www.zdf.de/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({
                    priorityList: [{
                        formitaeten: [{
                            qualities: [{
                                audio: {
                                    tracks: [{
                                        uri: "https://quux.de/corge.webm",
                                    }],
                                },
                            }],
                        }],
                    }],
                }),
            ));

            const url = new URL("https://www.zdf.de/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <button class="download-btn"
                                data-dialog="${JSON.stringify({
                            contentUrl: "http://bar.de/{playerId}/baz.json",
                            apiToken:   "qux",
                        }).replaceAll(`"`, "&quot;")}"></button>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file, "https://quux.de/corge.webm");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "http://bar.de/ngplayer_2_4/baz.json",
                { headers: new Headers({ "Api-Auth": "Bearer qux" }) },
            ]);

            stub.restore();
        });
    });
});
