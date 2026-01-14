/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import * as scraper from "../../../../src/core/scraper/dmax.js";
import "../../setup.js";

describe("core/scraper/dmax.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("extract()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://dmax.de/tv-programm/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async () => {
            const url = new URL("https://dmax.de/sendungen/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            '<html lang="en"><body></body></html>',
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return undefined when request is geoblocking", async () => {
            const fetch = mock.method(globalThis, "fetch", () => {
                switch (fetch.mock.callCount()) {
                    case 0:
                        return Promise.resolve(
                            Response.json({
                                data: { attributes: { token: "foo" } },
                            }),
                        );
                    case 1:
                        return Promise.resolve(
                            Response.json({ data: { id: "bar" } }),
                        );
                    case 2:
                        return Promise.resolve(Response.json({}));
                    default:
                        throw new Error("Fourth unexpected call");
                }
            });

            const url = new URL("https://dmax.de/sendungen/baz");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <hyoga-player assetid="qux" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 3);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://eu1-prod.disco-api.com/token?realm=dmaxde",
                {
                    headers: {
                        "x-device-info":
                            "STONEJS/1 (Unknown/Unknown;" +
                            " Unknown/Unknown; Unknown)",
                    },
                },
            ]);
            assert.deepEqual(fetch.mock.calls[1].arguments, [
                "https://eu1-prod.disco-api.com/content/videos/qux",
                { headers: { authorization: "Bearer foo" } },
            ]);
            assert.deepEqual(fetch.mock.calls[2].arguments, [
                "https://eu1-prod.disco-api.com/playback/v3/videoPlaybackInfo",
                {
                    method: "POST",
                    body: JSON.stringify({
                        deviceInfo: { adBlocker: false },
                        videoId: "bar",
                    }),
                    headers: {
                        "content-type": "application/json",
                        authorization: "Bearer foo",
                    },
                },
            ]);
        });

        it("should return undefined when no assetid and no showid", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({ data: { attributes: { token: "foo" } } }),
                ),
            );

            const url = new URL("https://dmax.de/sendungen/bar");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <hyoga-player />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://eu1-prod.disco-api.com/token?realm=dmaxde",
                {
                    headers: {
                        "x-device-info":
                            "STONEJS/1 (Unknown/Unknown;" +
                            " Unknown/Unknown; Unknown)",
                    },
                },
            ]);
        });

        it("should return undefined when no HLS video", async () => {
            const fetch = mock.method(globalThis, "fetch", () => {
                switch (fetch.mock.callCount()) {
                    case 0:
                        return Promise.resolve(
                            Response.json({
                                data: { attributes: { token: "foo" } },
                            }),
                        );
                    case 1:
                        return Promise.resolve(
                            Response.json({ data: [{ id: "bar" }] }),
                        );
                    case 2:
                        return Promise.resolve(
                            Response.json({
                                data: {
                                    attributes: {
                                        streaming: [
                                            {
                                                type: "baz",
                                                url: "https://qux.com",
                                            },
                                        ],
                                    },
                                },
                            }),
                        );
                    default:
                        throw new Error("Fourth unexpected call");
                }
            });

            const url = new URL("https://dmax.de/sendungen/quux");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <hyoga-player showid="corge" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 3);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://eu1-prod.disco-api.com/token?realm=dmaxde",
                {
                    headers: {
                        "x-device-info":
                            "STONEJS/1 (Unknown/Unknown;" +
                            " Unknown/Unknown; Unknown)",
                    },
                },
            ]);
            assert.deepEqual(fetch.mock.calls[1].arguments, [
                "https://eu1-prod.disco-api.com/content/videos/" +
                    "?filter[show.id]=corge",
                { headers: { authorization: "Bearer foo" } },
            ]);
            assert.deepEqual(fetch.mock.calls[2].arguments, [
                "https://eu1-prod.disco-api.com/playback/v3/videoPlaybackInfo",
                {
                    method: "POST",
                    body: JSON.stringify({
                        deviceInfo: { adBlocker: false },
                        videoId: "bar",
                    }),
                    headers: {
                        "content-type": "application/json",
                        authorization: "Bearer foo",
                    },
                },
            ]);
        });

        it("should return video URL from asset", async () => {
            const fetch = mock.method(globalThis, "fetch", () => {
                switch (fetch.mock.callCount()) {
                    case 0:
                        return Promise.resolve(
                            Response.json({
                                data: { attributes: { token: "foo" } },
                            }),
                        );
                    case 1:
                        return Promise.resolve(
                            Response.json({ data: { id: "bar" } }),
                        );
                    case 2:
                        return Promise.resolve(
                            Response.json({
                                data: {
                                    attributes: {
                                        streaming: [
                                            {
                                                type: "hls",
                                                url: "https://baz.com/qux.m3u8",
                                            },
                                        ],
                                    },
                                },
                            }),
                        );
                    default:
                        throw new Error("Fourth unexpected call");
                }
            });

            const url = new URL("https://dmax.de/sendungen/quux");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <hyoga-player assetid="corge" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://baz.com/qux.m3u8");

            assert.equal(fetch.mock.callCount(), 3);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://eu1-prod.disco-api.com/token?realm=dmaxde",
                {
                    headers: {
                        "x-device-info":
                            "STONEJS/1 (Unknown/Unknown;" +
                            " Unknown/Unknown; Unknown)",
                    },
                },
            ]);
            assert.deepEqual(fetch.mock.calls[1].arguments, [
                "https://eu1-prod.disco-api.com/content/videos/corge",
                { headers: { authorization: "Bearer foo" } },
            ]);
            assert.deepEqual(fetch.mock.calls[2].arguments, [
                "https://eu1-prod.disco-api.com/playback/v3/videoPlaybackInfo",
                {
                    method: "POST",
                    body: JSON.stringify({
                        deviceInfo: { adBlocker: false },
                        videoId: "bar",
                    }),
                    headers: {
                        "content-type": "application/json",
                        authorization: "Bearer foo",
                    },
                },
            ]);
        });

        it("should return video URL from show", async () => {
            const fetch = mock.method(globalThis, "fetch", () => {
                switch (fetch.mock.callCount()) {
                    case 0:
                        return Promise.resolve(
                            Response.json({
                                data: { attributes: { token: "foo" } },
                            }),
                        );
                    case 1:
                        return Promise.resolve(
                            Response.json({ data: [{ id: "bar" }] }),
                        );
                    case 2:
                        return Promise.resolve(
                            Response.json({
                                data: {
                                    attributes: {
                                        streaming: [
                                            {
                                                type: "hls",
                                                url: "https://baz.com/qux.m3u8",
                                            },
                                        ],
                                    },
                                },
                            }),
                        );
                    default:
                        throw new Error("Fourth unexpected call");
                }
            });

            const url = new URL("https://dmax.de/sendungen/quux");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <hyoga-player showid="corge" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://baz.com/qux.m3u8");

            assert.equal(fetch.mock.callCount(), 3);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://eu1-prod.disco-api.com/token?realm=dmaxde",
                {
                    headers: {
                        "x-device-info":
                            "STONEJS/1 (Unknown/Unknown;" +
                            " Unknown/Unknown; Unknown)",
                    },
                },
            ]);
            assert.deepEqual(fetch.mock.calls[1].arguments, [
                "https://eu1-prod.disco-api.com/content/videos/" +
                    "?filter[show.id]=corge",
                { headers: { authorization: "Bearer foo" } },
            ]);
            assert.deepEqual(fetch.mock.calls[2].arguments, [
                "https://eu1-prod.disco-api.com/playback/v3/videoPlaybackInfo",
                {
                    method: "POST",
                    body: JSON.stringify({
                        deviceInfo: { adBlocker: false },
                        videoId: "bar",
                    }),
                    headers: {
                        "content-type": "application/json",
                        authorization: "Bearer foo",
                    },
                },
            ]);
        });
    });
});
