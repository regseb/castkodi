import assert      from "assert";
import sinon       from "sinon";
import { extract } from "../../../../src/core/scraper/star.js";

describe("core/scraper/star.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://www.star.gr/foo/bar");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `
                configuration: {
                    mode: 'detectAutoPlay',
                    source: [{
                        name: 'Source name',
                        type: 'hls',
                        url: 'https://this/is/url/of/manifest.m3u8'
                    }]
                `,
            ));

            const url = new URL("https://www.star.gr/tv/foo");

            const file = await extract(url, null);
            assert.strictEqual(file, "https://this/is/url/of/manifest.m3u8");

            assert.strictEqual(stub.callCount, 1);
            stub.restore();
        });

        it("should return null when m3u8 url not present", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                    <body>
                        Dummy html.
                    </body>
                </html>
                `,
            ));

            const url = new URL("https://www.star.gr/tv/series");

            const file = await extract(url, null);
            assert.strictEqual(file, null);

            assert.strictEqual(stub.callCount, 1);
            stub.restore();
        });
    });
});
