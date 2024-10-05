/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/vidyard.js";

describe("core/scraper/vidyard.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.vidyard.com/video-hosting/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return video URL from vyContext", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                Response.json({
                    payload: {
                        vyContext: {
                            chapterAttributes: [
                                {
                                    // eslint-disable-next-line camelcase
                                    video_files: [
                                        {
                                            profile: "full_hd",
                                            url: "https://foo.com/bar.mp4",
                                        },
                                        {
                                            profile: "stream_master",
                                            url: "https://baz.com/qux.m3u8",
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                }),
            );

            const url = new URL("https://play.vidyard.com/quux");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "https://baz.com/qux.m3u8|Referer=https://play.vidyard.com/",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://play.vidyard.com/player/quux.json",
            ]);
        });

        it("should return video URL from chapters", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                Response.json({
                    payload: {
                        vyContext: {
                            // eslint-disable-next-line camelcase
                            chapterAttributes: [{ video_files: [] }],
                        },
                        chapters: [
                            {
                                sources: {
                                    hls: [{ url: "https://foo.com/bar.hls" }],
                                },
                            },
                        ],
                    },
                }),
            );

            const url = new URL("https://play.vidyard.com/baz?qux=1");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "https://foo.com/bar.hls|Referer=https://play.vidyard.com/",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://play.vidyard.com/player/baz.json",
            ]);
        });

        it("should return video URL from pathname with extension", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                Response.json({
                    payload: {
                        chapters: [
                            {
                                sources: {
                                    hls: [{ url: "https://foo.com/bar.hls" }],
                                },
                            },
                        ],
                    },
                }),
            );

            // Ajouter deux fois l'extension ".html" pour vérifier que c'est
            // seulement la dernière qui est enlevée.
            const url = new URL("https://play.vidyard.com/baz.html.qux.html?");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "https://foo.com/bar.hls|Referer=https://play.vidyard.com/",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://play.vidyard.com/player/baz.html.qux.json",
            ]);
        });
    });
});
