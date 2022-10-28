import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/kcaastreaming.js";

describe("core/scraper/kcaastreaming.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("http://www.kcaaradio.com/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return audio URL", async function () {
            const url = new URL("https://live.kcaastreaming.com/");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <div id="show">
                          <a href="///foo.com/bar.mp3">Baz</a>
                        </div>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.equal(file, "https://foo.com/bar.mp3");
        });
    });
});
