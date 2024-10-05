/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/zdf.js";

describe("core/scraper/zdf.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.zdftext.de/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async function () {
            const url = new URL("https://www.zdf.de/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            "<html><body></body></html>",
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                Response.json({
                    priorityList: [
                        {
                            formitaeten: [
                                {
                                    qualities: [
                                        {
                                            audio: {
                                                tracks: [
                                                    {
                                                        uri:
                                                            "https://foo.de" +
                                                            "/bar.webm",
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                }),
            );

            const url = new URL("https://www.zdf.de/baz");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `
                    <html><body>
                      <button class="download-btn"
                              data-dialog="${JSON.stringify({
                                  contentUrl:
                                      "https://qux.de/{playerId}/quux.json",
                                  apiToken: "corge",
                              }).replaceAll('"', "&quot;")}"></button>
                    </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://foo.de/bar.webm");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://qux.de/ngplayer_2_4/quux.json",
                { headers: { "Api-Auth": "Bearer corge" } },
            ]);
        });
    });
});
