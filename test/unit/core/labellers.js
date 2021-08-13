import assert from "node:assert";
import sinon from "sinon";
import { complete } from "../../../src/core/labellers.js";

describe("core/labellers.js", function () {
    describe("extract()", function () {
        it("should return 'title' when it's present", async function () {
            const item = {
                file:  "https://foo.com/",
                label: "bar",
                title: "baz",
            };

            const result = await complete(item);
            assert.deepStrictEqual(result, {
                file:  "https://foo.com/",
                label: "baz",
                title: "baz",
            });
        });

        it("should return 'title' striped", async function () {
            const item = {
                file:  "https://foo.com/",
                label: "bar",
                title: "[B]baz[/B]",
            };

            const result = await complete(item);
            assert.deepStrictEqual(result, {
                file:  "https://foo.com/",
                label: "baz",
                title: "[B]baz[/B]",
            });
        });

        it("should return 'label' when no labeller", async function () {
            const item = {
                file:  "https://foo.com/",
                label: "bar",
                title: "",
            };

            const result = await complete(item);
            assert.deepStrictEqual(result, {
                file:  "https://foo.com/",
                label: "bar",
                title: "",
            });
        });

        it("should return 'file' when no labeller and no 'label'",
                                                             async function () {
            const item = {
                file:  "https://foo.com/",
                label: "",
                title: "",
            };

            const result = await complete(item);
            assert.deepStrictEqual(result, {
                file:  "https://foo.com/",
                label: "https://foo.com/",
                title: "",
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
                file:  "plugin://plugin.video.youtube/play/?video_id=foo",
                label: "bar",
                title: "",
            };

            const result = await complete(item);
            assert.deepStrictEqual(result, {
                file:  "plugin://plugin.video.youtube/play/?video_id=foo",
                label: "bar",
                title: "",
            });

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.youtube.com/watch?v=foo",
            ]);

            stub.restore();
        });

        it("should support local file", async function () {
            const item = {
                file:  "/foo/bar.mp3",
                label: "",
                title: "",
            };

            const result = await complete(item);
            assert.deepStrictEqual(result, {
                file:  "/foo/bar.mp3",
                label: "/foo/bar.mp3",
                title: "",
            });
        });

        it("should strip tags in label",  async function () {
            const item = {
                file:  "/foo.mkv",
                label: "[B][UPPERCASE]Label[/UPPERCASE][/B] !",
                title: "",
            };

            const result = await complete(item);
            assert.deepStrictEqual(result, {
                file:  "/foo.mkv",
                label: "Label !",
                title: "",
            });
        });
    });
});
