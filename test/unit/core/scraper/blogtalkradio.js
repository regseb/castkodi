import assert      from "assert";
import { extract } from "../../../../src/core/scraper/blogtalkradio.js";

describe("core/scraper/blogtalkradio.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://help.blogtalkradio.com/en/";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not an audio", async function () {
            const url = "https://www.blogtalkradio.com/foo";
            const doc = new DOMParser().parseFromString(`
                <html>
                  <head></head>
                </html>`, "text/html");
            const expected = null;

            const file = await extract(new URL(url), doc);
            assert.strictEqual(file, expected);
        });

        it("should return audio URL", async function () {
            const url = "https://www.blogtalkradio.com/foo";
            const doc = new DOMParser().parseFromString(`
                <html>
                  <head>
                    <meta property="twitter:player:stream"
                          content="https://foo.com/bar.mp3" />
                  </head>
                </html>`, "text/html");
            const expected = "https://foo.com/bar.mp3";

            const file = await extract(new URL(url), doc);
            assert.strictEqual(file, expected);
        });
    });
});
