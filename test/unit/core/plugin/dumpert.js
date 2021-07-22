import assert from "node:assert";
import sinon from "sinon";
import * as plugin from "../../../../src/core/plugin/dumpert.js";

describe("core/plugin/dumpert.js", function () {
    describe("generateUrl()", function () {
        it("should return URL with video URL", async function () {
            const label = await plugin.generateUrl(new URL("http://foo.com" +
                                                                  "/bar.html"));
            assert.strictEqual(label,
                "plugin://plugin.video.dumpert/?action=play" +
                             "&video_page_url=http%3A%2F%2Ffoo.com%2Fbar.html");
        });
    });

    describe("extract()", function () {
        it("should return null when there isn't 'video_page_url' parameter",
                                                             async function () {
            const url = new URL("plugin://plugin.video.dumpert/?foo=bar");

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

            const url = new URL("plugin://plugin.video.dumpert/" +
                                     "?video_page_url=http%3A%2F%2Ffoo.com%2F");

            const label = await plugin.extract(url);
            assert.strictEqual(label, "bar");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, ["http://foo.com/"]);

            stub.restore();
        });
    });
});
