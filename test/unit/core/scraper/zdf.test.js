/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import * as scraper from "../../../../src/core/scraper/zdf.js";
import "../../setup.js";

describe("core/scraper/zdf.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("extract()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://www.zdftext.de/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async () => {
            const url = new URL("https://www.zdf.de/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            '<html lang="de"><body></body></html>',
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't token", async () => {
            const url = new URL("https://www.zdf.de/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="de"><body>
                               <script></script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return undefined when no 'ptmdTemplate'", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(Response.json({ data: {} })),
            );

            const url = new URL("https://www.zdf.de/foo/bar");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            String.raw`<html lang="de"><body>
                              <script>
                                {\"videoToken\":{\"apiToken\":\"baz\"}}
                              </script>
                            </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://api.zdf.de/graphql",
                {
                    method: "POST",
                    headers: {
                        "Api-Auth": "Bearer baz",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        operationName: "VideoByCanonical",
                        query:
                            "query VideoByCanonical($canonical: String!) {" +
                            "  videoByCanonical(canonical: $canonical) {" +
                            "    currentMedia { nodes { ptmdTemplate } }" +
                            "  }" +
                            "}",
                        variables: { canonical: "bar" },
                    }),
                },
            ]);
        });

        it("should return video URL", async () => {
            const fetch = mock.method(globalThis, "fetch", () => {
                switch (fetch.mock.callCount()) {
                    case 0:
                        return Promise.resolve(
                            Response.json({
                                data: {
                                    videoByCanonical: {
                                        currentMedia: {
                                            nodes: [
                                                {
                                                    ptmdTemplate:
                                                        "/foo/{playerId}/bar",
                                                },
                                            ],
                                        },
                                    },
                                },
                            }),
                        );
                    case 1:
                        return Promise.resolve(
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
                                                                    uri: "https://baz.de/qux.webm",
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
                    default:
                        throw new Error("Third unexpected call");
                }
            });

            const url = new URL("https://www.zdf.de/quxx/corge");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            String.raw`<html lang="de"><body>
                              <script>
                                {\"videoToken\":{\"apiToken\":\"grault\"}}
                              </script>
                            </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://baz.de/qux.webm");

            assert.equal(fetch.mock.callCount(), 2);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://api.zdf.de/graphql",
                {
                    method: "POST",
                    headers: {
                        "Api-Auth": "Bearer grault",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        operationName: "VideoByCanonical",
                        query:
                            "query VideoByCanonical($canonical: String!) {" +
                            "  videoByCanonical(canonical: $canonical) {" +
                            "    currentMedia { nodes { ptmdTemplate } }" +
                            "  }" +
                            "}",
                        variables: { canonical: "corge" },
                    }),
                },
            ]);
            assert.deepEqual(fetch.mock.calls[1].arguments, [
                "https://api.zdf.de/foo/ngplayer_2_5/bar",
                { headers: { "Api-Auth": "Bearer grault" } },
            ]);
        });
    });
});
