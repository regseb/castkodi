import assert from "node:assert";
import sinon from "sinon";
import { extract } from "../../../../src/core/labeller/dailymotion.js";

describe("core/labeller/dailymotion.js", function () {
    describe("extract()", function () {
        it("should return null when there isn't 'url' parameter",
                                                             async function () {
            const url = new URL("plugin://plugin.video.dailymotion_com/" +
                                                                    "?foo=bar");

            const label = await extract(url);
            assert.strictEqual(label, null);
        });

        it("should return video label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head>
                     <meta property="og:title" content="bar - baz - qux" />
                   </head>
                 </html>`,
            ));

            const url = new URL("plugin://plugin.video.dailymotion_com/" +
                                                                    "?url=foo");

            const label = await extract(url);
            assert.strictEqual(label, "bar - baz");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.dailymotion.com/video/foo",
            ]);

            stub.restore();
        });
    });
});
