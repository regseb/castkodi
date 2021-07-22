import assert from "node:assert";
import sinon from "sinon";
import * as plugin from "../../../../src/core/plugin/vimeo.js";

describe("core/plugin/vimeo.js", function () {
    describe("generateUrl()", function () {
        it("should return URL with video id", async function () {
            const label = await plugin.generateUrl("foo");
            assert.strictEqual(label,
                "plugin://plugin.video.vimeo/play/?video_id=foo");
        });
    });

    describe("extract()", function () {
        it("should return null when there isn't 'video_id' parameter",
                                                             async function () {
            const url = new URL("plugin://plugin.video.vimeo/play/?foo=bar");

            const label = await plugin.extract(url);
            assert.strictEqual(label, null);
        });

        it("should return video label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head>
                     <meta property="og:title" content="bar" />
                   </head>
                 </html>`,
            ));

            const url = new URL("plugin://plugin.video.vimeo/play/" +
                                                               "?video_id=foo");

            const label = await plugin.extract(url);
            assert.strictEqual(label, "bar");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://vimeo.com/foo",
            ]);

            stub.restore();
        });
    });
});
