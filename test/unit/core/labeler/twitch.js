/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as labeler from "../../../../src/core/labeler/twitch.js";

describe("core/labeler/twitch.js", function () {
    describe("extractClip()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://appeals.twitch.tv/");

            const file = await labeler.extractClip(url);
            assert.equal(file, undefined);
        });

        it("should return embed clip label", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .resolves(
                    Response.json([{ data: { clip: { title: "foo" } } }]),
                );

            const url = new URL("https://clips.twitch.tv/embed?clip=bar");

            const label = await labeler.extractClip(url);
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://gql.twitch.tv/gql",
                {
                    headers: { "Client-Id": "kimne78kx3ncx6brgo4mv6wki5h1ko" },
                    body: JSON.stringify([
                        {
                            operationName: "ShareClipRenderStatus",
                            variables: { slug: "bar" },
                            extensions: {
                                persistedQuery: {
                                    version: 1,
                                    sha256Hash:
                                        "f130048a462a0ac86bb54d653c968c514e9a" +
                                        "b9ca94db52368c1179e97b0f16eb",
                                },
                            },
                        },
                    ]),
                    method: "POST",
                },
            ]);
        });

        it("should return undefined when it isn't a clip", async function () {
            const url = new URL("https://clips.twitch.tv/embed?noclip=foo");

            const file = await labeler.extractClip(url);
            assert.equal(file, undefined);
        });

        it("should return clip label", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .resolves(
                    Response.json([{ data: { clip: { title: "foo" } } }]),
                );

            const url = new URL("https://clips.twitch.tv/bar");

            const label = await labeler.extractClip(url);
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://gql.twitch.tv/gql",
                {
                    headers: { "Client-Id": "kimne78kx3ncx6brgo4mv6wki5h1ko" },
                    body: JSON.stringify([
                        {
                            operationName: "ShareClipRenderStatus",
                            variables: { slug: "bar" },
                            extensions: {
                                persistedQuery: {
                                    version: 1,
                                    sha256Hash:
                                        "f130048a462a0ac86bb54d653c968c514e9a" +
                                        "b9ca94db52368c1179e97b0f16eb",
                                },
                            },
                        },
                    ]),
                    method: "POST",
                },
            ]);
        });
    });

    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://appeals.twitch.tv/");

            const file = await labeler.extract(url);
            assert.equal(file, undefined);
        });

        it("should return video label", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .resolves(
                    Response.json([{ data: { video: { title: "foo" } } }]),
                );

            const url = new URL("https://www.twitch.tv/videos/bar");

            const label = await labeler.extract(url);
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://gql.twitch.tv/gql",
                {
                    headers: { "Client-Id": "kimne78kx3ncx6brgo4mv6wki5h1ko" },
                    body: JSON.stringify([
                        {
                            operationName: "AdRequestHandling",
                            variables: {
                                isLive: false,
                                login: "",
                                isVOD: true,
                                vodID: "bar",
                                isCollection: false,
                                collectionID: "",
                            },
                            extensions: {
                                persistedQuery: {
                                    version: 1,
                                    sha256Hash:
                                        "61a5ecca6da3d924efa9dbde811e051b8a10" +
                                        "cb6bd0fe22c372c2f4401f3e88d1",
                                },
                            },
                        },
                    ]),
                    method: "POST",
                },
            ]);
        });

        it("should return clip label", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .resolves(
                    Response.json([{ data: { clip: { title: "foo" } } }]),
                );

            const url = new URL("https://www.twitch.tv/bar/clip/baz");

            const label = await labeler.extract(url);
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://gql.twitch.tv/gql",
                {
                    headers: { "Client-Id": "kimne78kx3ncx6brgo4mv6wki5h1ko" },
                    body: JSON.stringify([
                        {
                            operationName: "ShareClipRenderStatus",
                            variables: { slug: "baz" },
                            extensions: {
                                persistedQuery: {
                                    version: 1,
                                    sha256Hash:
                                        "f130048a462a0ac86bb54d653c968c514e9a" +
                                        "b9ca94db52368c1179e97b0f16eb",
                                },
                            },
                        },
                    ]),
                    method: "POST",
                },
            ]);
        });

        it("should return live label", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .resolves(
                    Response.json([
                        { data: { userOrError: { displayName: "foo" } } },
                    ]),
                );

            const url = new URL("https://www.twitch.tv/bar");

            const label = await labeler.extract(url);
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://gql.twitch.tv/gql",
                {
                    headers: { "Client-Id": "kimne78kx3ncx6brgo4mv6wki5h1ko" },
                    body: JSON.stringify([
                        {
                            operationName: "ChannelShell",
                            variables: { login: "bar" },
                            extensions: {
                                persistedQuery: {
                                    version: 1,
                                    sha256Hash:
                                        "580ab410bcd0c1ad194224957ae2241e5d25" +
                                        "2b2c5173d8e0cce9d32d5bb14efe",
                                },
                            },
                        },
                    ]),
                    method: "POST",
                },
            ]);
        });
    });
});
