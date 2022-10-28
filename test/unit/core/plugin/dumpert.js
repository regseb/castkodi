import assert from "node:assert/strict";
import sinon from "sinon";
import * as plugin from "../../../../src/core/plugin/dumpert.js";

describe("core/plugin/dumpert.js", function () {
    describe("generateUrl()", function () {
        it("should return URL with video URL", async function () {
            const label = await plugin.generateUrl(new URL("http://foo.com" +
                                                                  "/bar.html"));
            assert.equal(label,
                "plugin://plugin.video.dumpert/" +
                    "?action=play" +
                    "&video_page_url=http%3A%2F%2Ffoo.com%2Fbar.html");
        });
    });

    describe("extract()", function () {
        it("should return undefined when there isn't 'video_page_url'" +
                                                                   " parameter",
                                                             async function () {
            const url = new URL("plugin://plugin.video.dumpert/?foo=bar");

            const label = await plugin.extract(url);
            assert.equal(label, undefined);
        });

        it("should return video label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head>
                     <meta property="og:title" content="foo" />
                   </head>
                 </html>`,
            ));

            const url = new URL("plugin://plugin.video.dumpert/" +
                                     "?video_page_url=http%3A%2F%2Fbar.com%2F");

            const label = await plugin.extract(url);
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [new URL("http://bar.com/")]);
        });
    });
});
