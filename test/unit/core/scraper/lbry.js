import assert      from "assert";
import { extract } from "../../../../src/core/scraper/lbry.js";

describe("core/scraper/lbry.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://lbry.tech/";

            const file = await extract(new URL(url));
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a video", async function () {
            const url = "https://lbry.tv/foo";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head></head>
                    </html>`, "text/html")),
            };

            const file = await extract(new URL(url), content);
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const url = "https://lbry.tv/foo";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head>
                        <meta property="og:video:secure_url"
                              content="https://lbry.tv/$/embed/bar" />
                      </head>
                    </html>`, "text/html")),
            };

            const file = await extract(new URL(url), content);
            assert.strictEqual(file,
                "https://cdn.lbryplayer.xyz/api/v2/streams/free/bar");
        });
    });
});
