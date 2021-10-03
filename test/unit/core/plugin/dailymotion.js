import assert from "node:assert";
import sinon from "sinon";
import * as plugin from "../../../../src/core/plugin/dailymotion.js";

describe("core/plugin/dailymotion.js", function () {
    describe("generateUrl()", function () {
        it("should return URL with video id", async function () {
            const label = await plugin.generateUrl("foo");
            assert.strictEqual(label,
                "plugin://plugin.video.dailymotion_com/" +
                                                     "?mode=playVideo&url=foo");
        });
    });

    describe("extract()", function () {
        it("should return null when there isn't 'url' parameter",
                                                             async function () {
            const url = new URL("plugin://plugin.video.dailymotion_com/" +
                                                                    "?foo=bar");

            const label = await plugin.extract(url);
            assert.strictEqual(label, null);
        });

        it("should return video label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head>
                     <meta property="og:title" content="foo - bar - baz" />
                   </head>
                 </html>`,
            ));

            const url = new URL("plugin://plugin.video.dailymotion_com/" +
                                                                    "?url=qux");

            const label = await plugin.extract(url);
            assert.strictEqual(label, "foo - bar");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.dailymotion.com/video/qux",
            ]);
        });
    });
});
