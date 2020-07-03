import assert      from "assert";
import sinon       from "sinon";
import { extract } from "../../../../src/core/labeller/dumpert.js";

describe("core/labeller/dumpert.js", function () {
    describe("extract()", function () {
        it("should return null when there isn't 'video_page_url' parameter",
                                                             async function () {
            const url = "plugin://plugin.video.dumpert/?foo=bar";

            const label = await extract(new URL(url));
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

            const url = "plugin://plugin.video.dumpert/" +
                                      "?video_page_url=http%3A%2F%2Ffoo.com%2F";

            const label = await extract(new URL(url));
            assert.strictEqual(label, "bar");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, ["http://foo.com/"]);

            stub.restore();
        });
    });
});
