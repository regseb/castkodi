import assert from "node:assert";
import { extract } from "../../../../src/core/scraper/blogtalkradio.js";

describe("core/scraper/blogtalkradio.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://help.blogtalkradio.com/en/");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when it's not an audio", async function () {
            const url = new URL("https://www.blogtalkradio.com/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head></head>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return audio URL", async function () {
            const url = new URL("https://www.blogtalkradio.com/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head>
                        <meta property="twitter:player:stream"
                              content="https://foo.com/bar.mp3" />
                      </head>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file, "https://foo.com/bar.mp3");
        });
    });
});
