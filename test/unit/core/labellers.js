import assert from "node:assert";
import sinon from "sinon";
import { complete } from "../../../src/core/labellers.js";

describe("core/labellers.js", function () {
    describe("extract()", function () {
        it("should return 'label' when no labeller", async function () {
            const item = {
                file:  "https://foo.com/",
                label: "bar",
            };

            const result = await complete(item);
            assert.deepStrictEqual(result, {
                file:  "https://foo.com/",
                label: "bar",
            });
        });

        it("should return 'file' when no labeller and no 'label'",
                                                             async function () {
            const item = {
                file:  "https://foo.com/",
                label: "",
            };

            const result = await complete(item);
            assert.deepStrictEqual(result, {
                file:  "https://foo.com/",
                label: "https://foo.com/",
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
            };

            const result = await complete(item);
            assert.deepStrictEqual(result, {
                file:  "plugin://plugin.video.youtube/play/?video_id=foo",
                label: "bar",
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
            };

            const result = await complete(item);
            assert.deepStrictEqual(result, {
                file:  "/foo/bar.mp3",
                label: "/foo/bar.mp3",
            });
        });

        it("should strip tags",  async function () {
            const item = {
                file:  "/foo.mkv",
                label: "[B][UPPERCASE]Label[/UPPERCASE][/B] !",
            };

            const result = await complete(item);
            assert.deepStrictEqual(result, {
                file:  "/foo.mkv",
                label: "Label !",
            });
        });
    });
});
