/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/dmax.js";

describe("core/scraper/dmax.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://dmax.de/tv-programm/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async function () {
            const url = new URL("https://dmax.de/sendungen/foo");
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

        it("should return undefined when request is geoblocking", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .onFirstCall()
                .resolves(
                    Response.json({
                        data: { attributes: { token: "foo" } },
                    }),
                )
                .onSecondCall()
                .resolves(
                    Response.json({
                        data: { id: "bar" },
                    }),
                )
                .onThirdCall()
                .resolves(Response.json({}));

            const url = new URL("https://dmax.de/sendungen/baz");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <hyoga-player assetid="qux" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);

            assert.equal(stub.callCount, 3);
            assert.deepEqual(stub.firstCall.args, [
                "https://eu1-prod.disco-api.com/token?realm=dmaxde",
                {
                    headers: {
                        "x-device-info":
                            "STONEJS/1 (Unknown/Unknown;" +
                            " Unknown/Unknown; Unknown)",
                    },
                },
            ]);
            assert.deepEqual(stub.secondCall.args, [
                "https://eu1-prod.disco-api.com/content/videos/qux",
                { headers: { authorization: "Bearer foo" } },
            ]);
            assert.deepEqual(stub.thirdCall.args, [
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

        it("should return undefined when no assetid and no showid", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .resolves(
                    Response.json({ data: { attributes: { token: "foo" } } }),
                );

            const url = new URL("https://dmax.de/sendungen/bar");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <hyoga-player />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
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

        it("should return undefined when no HLS video", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .onFirstCall()
                .resolves(
                    Response.json({
                        data: { attributes: { token: "foo" } },
                    }),
                )
                .onSecondCall()
                .resolves(
                    Response.json({
                        data: [{ id: "bar" }],
                    }),
                )
                .onThirdCall()
                .resolves(
                    Response.json({
                        data: {
                            attributes: {
                                streaming: [
                                    {
                                        type: "baz",
                                        url: "http://qux.com",
                                    },
                                ],
                            },
                        },
                    }),
                );

            const url = new URL("https://dmax.de/sendungen/quux");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <hyoga-player showid="corge" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);

            assert.equal(stub.callCount, 3);
            assert.deepEqual(stub.firstCall.args, [
                "https://eu1-prod.disco-api.com/token?realm=dmaxde",
                {
                    headers: {
                        "x-device-info":
                            "STONEJS/1 (Unknown/Unknown;" +
                            " Unknown/Unknown; Unknown)",
                    },
                },
            ]);
            assert.deepEqual(stub.secondCall.args, [
                "https://eu1-prod.disco-api.com/content/videos/" +
                    "?filter[show.id]=corge",
                { headers: { authorization: "Bearer foo" } },
            ]);
            assert.deepEqual(stub.thirdCall.args, [
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

        it("should return video URL from asset", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .onFirstCall()
                .resolves(
                    Response.json({
                        data: { attributes: { token: "foo" } },
                    }),
                )
                .onSecondCall()
                .resolves(
                    Response.json({
                        data: { id: "bar" },
                    }),
                )
                .onThirdCall()
                .resolves(
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

            const url = new URL("https://dmax.de/sendungen/quux");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <hyoga-player assetid="corge" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://baz.com/qux.m3u8");

            assert.equal(stub.callCount, 3);
            assert.deepEqual(stub.firstCall.args, [
                "https://eu1-prod.disco-api.com/token?realm=dmaxde",
                {
                    headers: {
                        "x-device-info":
                            "STONEJS/1 (Unknown/Unknown;" +
                            " Unknown/Unknown; Unknown)",
                    },
                },
            ]);
            assert.deepEqual(stub.secondCall.args, [
                "https://eu1-prod.disco-api.com/content/videos/corge",
                { headers: { authorization: "Bearer foo" } },
            ]);
            assert.deepEqual(stub.thirdCall.args, [
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

        it("should return video URL from show", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .onFirstCall()
                .resolves(
                    Response.json({
                        data: { attributes: { token: "foo" } },
                    }),
                )
                .onSecondCall()
                .resolves(
                    Response.json({
                        data: [{ id: "bar" }],
                    }),
                )
                .onThirdCall()
                .resolves(
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

            const url = new URL("https://dmax.de/sendungen/quux");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <hyoga-player showid="corge" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://baz.com/qux.m3u8");

            assert.equal(stub.callCount, 3);
            assert.deepEqual(stub.firstCall.args, [
                "https://eu1-prod.disco-api.com/token?realm=dmaxde",
                {
                    headers: {
                        "x-device-info":
                            "STONEJS/1 (Unknown/Unknown;" +
                            " Unknown/Unknown; Unknown)",
                    },
                },
            ]);
            assert.deepEqual(stub.secondCall.args, [
                "https://eu1-prod.disco-api.com/content/videos/" +
                    "?filter[show.id]=corge",
                { headers: { authorization: "Bearer foo" } },
            ]);
            assert.deepEqual(stub.thirdCall.args, [
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
