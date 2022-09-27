import assert from "node:assert";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/ballysports.js";

describe("core/scraper/ballysports.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("https://www.ballysports.com/national/news" +
                                                                        "/foo");

            const file = await scraper.extract(url);
            assert.strictEqual(file, undefined);
        });

        it("should return undefined when there isn't video", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({}),
            ));

            const url = new URL("https://www.ballysports.com/watch/vod/foo");

            const file = await scraper.extract(url);
            assert.strictEqual(file, undefined);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://cdn.ballysports.deltatre.digital/api/items/foo" +
                                                          "?use_custom_id=true",
            ]);
        });

        // Désactiver ce test car jsdom (avec nwsapi) n'est pas identique à
        // DOMParser des navigateurs. https://github.com/jsdom/jsdom/issues/3416
        it.skip("should return video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch")
                .onFirstCall().resolves(new Response(JSON.stringify({
                    videoId: "foo",
                }))).onSecondCall().resolves(new Response(
                    `<video>
                       <videoSource name="HLSv3">
                         <uri><![CDATA[https://bar.com/baz.m3u8]]></uri>
                       </videoSource>
                     </video>`,
                ));

            const url = new URL("https://www.ballysports.com/watch/vod/qux");

            const file = await scraper.extract(url);
            assert.strictEqual(file, "https://baz.com/qux.m3u8");

            assert.strictEqual(stub.callCount, 2);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://cdn.ballysports.deltatre.digital/api/items/qux" +
                                                          "?use_custom_id=true",
            ]);
            assert.deepStrictEqual(stub.secondCall.args, [
                "https://eu1-prod.disco-api.com/content/videos/corge",
                { headers: { authorization: "Bearer foo" } },
            ]);
        });
    });
});
