import assert from "node:assert";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/srf.js";

describe("core/scraper/srf.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://www.srf.ch/foo");

            const file = await scraper.extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when there isn't urn", async function () {
            const url = new URL("https://www.srf.ch/play/tv/foo");

            const file = await scraper.extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when urn is invalid", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({ status: "foo" }),
            ));

            const url = new URL("https://www.srf.ch/play/tv/bar?urn=baz");

            const file = await scraper.extract(url);
            assert.strictEqual(file, null);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://il.srgssr.ch/integrationlayer/2.0/mediaComposition" +
                                                                   "/byUrn/baz",
            ]);
        });

        it("should return video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({
                    chapterList: [{
                        resourceList: [{
                            analyticsMetadata: {
                                // eslint-disable-next-line camelcase
                                media_url: "http://foo.ch/bar.m3u8",
                            },
                        }],
                    }],
                }),
            ));

            const url = new URL("https://www.srf.ch/play/tv/bar?urn=baz");

            const file = await scraper.extract(url);
            assert.strictEqual(file, "http://foo.ch/bar.m3u8");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://il.srgssr.ch/integrationlayer/2.0/mediaComposition" +
                                                                   "/byUrn/baz",
            ]);
        });
    });
});
