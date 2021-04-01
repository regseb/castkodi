import assert      from "assert";
import sinon       from "sinon";
import { extract } from "../../../../src/core/labeller/twitch.js";

describe("core/labeller/twitch.js", function () {
    describe("extract()", function () {
        it("should return null when there isn't parameter", async function () {
            const url = new URL("plugin://plugin.video.twitch/");

            const label = await extract(url);
            assert.strictEqual(label, null);
        });

        it("should return live label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head>
                     <script type="application/ld+json">
                        [
                            { &quot;description&quot;: &quot;bar&quot; }
                        ]
                     </script>
                   </head>
                 </html>`,
            ));

            const url = new URL("plugin://plugin.video.twitch/" +
                                                           "?channel_name=foo");

            const label = await extract(url);
            assert.strictEqual(label, "bar");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://m.twitch.tv/foo",
            ]);

            stub.restore();
        });

        it("should return channel name when channel is offline",
                                                             async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head>
                     <script type="application/ld+json">
                        [
                            {
                                &quot;author&quot;: { &quot;name&quot;: "bar" },
                                &quot;description&quot;: &quot;&quot;
                            }
                        ]
                     </script>
                   </head>
                 </html>`,
            ));

            const url = new URL("plugin://plugin.video.twitch/" +
                                                           "?channel_name=foo");

            const label = await extract(url);
            assert.strictEqual(label, "bar");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://m.twitch.tv/foo",
            ]);

            stub.restore();
        });

        it("should return video label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head>
                     <script type="application/ld+json">
                        [
                            { &quot;description&quot;: &quot;bar&quot; }
                        ]
                     </script>
                   </head>
                 </html>`,
            ));

            const url = new URL("plugin://plugin.video.twitch/?video_id=foo");

            const label = await extract(url);
            assert.strictEqual(label, "bar");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://m.twitch.tv/videos/foo",
            ]);

            stub.restore();
        });

        it("should return clip label", async function () {
            const url = new URL("plugin://plugin.video.twitch/?slug=foo");

            const label = await extract(url);
            assert.strictEqual(label, "foo");
        });
    });
});
