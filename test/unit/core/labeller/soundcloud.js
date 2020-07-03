import assert      from "assert";
import sinon       from "sinon";
import { extract } from "../../../../src/core/labeller/soundcloud.js";

describe("core/labeller/soundcloud.js", function () {
    describe("extract()", function () {
        it("should return null when there isn't 'url' parameter",
                                                             async function () {
            const url = "plugin://plugin.audio.soundcloud/play/?foo=bar";

            const label = await extract(new URL(url));
            assert.strictEqual(label, null);
        });

        it("should return audio label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head>
                     <meta property="og:title" content="bar" />
                   </head>
                 </html>`,
            ));

            const url = "plugin://plugin.audio.soundcloud/play/" +
                                                 "?url=http%3A%2F%2Ffoo.com%2F";

            const label = await extract(new URL(url));
            assert.strictEqual(label, "bar");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, ["http://foo.com/"]);

            stub.restore();
        });

        it("should return null when it's not audio page", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head></head>
                 </html>`,
            ));

            const url = "plugin://plugin.audio.soundcloud/play/" +
                                                 "?url=http%3A%2F%2Ffoo.com%2F";

            const label = await extract(new URL(url));
            assert.strictEqual(label, null);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, ["http://foo.com/"]);

            stub.restore();
        });
    });
});
