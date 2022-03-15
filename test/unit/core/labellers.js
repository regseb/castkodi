import assert from "node:assert";
import sinon from "sinon";
import { complete } from "../../../src/core/labellers.js";

describe("core/labellers.js", function () {
    describe("extract()", function () {
        it("should return 'title' when it's present", async function () {
            const item = {
                file:     "https://foo.com/",
                label:    "bar",
                position: 0,
                title:    "baz",
                type:     "",
            };

            const result = await complete(item);
            assert.deepStrictEqual(result, {
                file:     "https://foo.com/",
                label:    "baz",
                position: 0,
                title:    "baz",
                type:     "",
            });
        });

        it("should return 'title' striped", async function () {
            const item = {
                file:     "https://foo.com/",
                label:    "bar",
                position: 0,
                title:    "[B]baz[/B]",
                type:     "",
            };

            const result = await complete(item);
            assert.deepStrictEqual(result, {
                file:     "https://foo.com/",
                label:    "baz",
                position: 0,
                title:    "[B]baz[/B]",
                type:     "",
            });
        });

        it("should return 'label' when no labeller", async function () {
            const item = {
                file:     "https://foo.com/",
                label:    "bar",
                position: 0,
                title:    "",
                type:     "",
            };

            const result = await complete(item);
            assert.deepStrictEqual(result, {
                file:     "https://foo.com/",
                label:    "bar",
                position: 0,
                title:    "",
                type:     "",
            });
        });

        it("should return 'file' when no labeller and no 'label'",
                                                             async function () {
            const item = {
                file:     "https://foo.com/",
                label:    "",
                position: 0,
                title:    "",
                type:     "",
            };

            const result = await complete(item);
            assert.deepStrictEqual(result, {
                file:     "https://foo.com/",
                label:    "https://foo.com/",
                position: 0,
                title:    "",
                type:     "",
            });
        });

        it("should return 'label' from labeller", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head>
                     <meta property="og:title" content="bar" />
                   </head>
                 </html>`,
            ));

            const item = {
                file:     "plugin://plugin.video.youtube/play/?video_id=foo",
                label:    "baz",
                position: 0,
                title:    "",
                type:     "",
            };

            const result = await complete(item);
            assert.deepStrictEqual(result, {
                file:     "plugin://plugin.video.youtube/play/?video_id=foo",
                label:    "bar",
                position: 0,
                title:    "",
                type:     "",
            });

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.youtube.com/watch?v=foo",
            ]);
        });

        it("should support local file", async function () {
            const item = {
                file:     "/foo/bar.mp3",
                label:    "",
                position: 0,
                title:    "",
                type:     "",
            };

            const result = await complete(item);
            assert.deepStrictEqual(result, {
                file:     "/foo/bar.mp3",
                label:    "/foo/bar.mp3",
                position: 0,
                title:    "",
                type:     "",
            });
        });

        it("should strip tags in label",  async function () {
            const item = {
                file:     "/foo.mkv",
                label:    "[B][UPPERCASE]Bar[/UPPERCASE][/B] !",
                position: 0,
                title:    "",
                type:     "",
            };

            const result = await complete(item);
            assert.deepStrictEqual(result, {
                file:     "/foo.mkv",
                label:    "Bar !",
                position: 0,
                title:    "",
                type:     "",
            });
        });
    });
});
