import assert      from "assert";
import { extract } from "../../../../src/core/scraper/kcaastreaming.js";

describe("core/scraper/kcaastreaming.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "http://www.kcaaradio.com/";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return audio URL", async function () {
            const url = "http://live.kcaastreaming.com/";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <div id="show">
                          <a href="http://foo.com:123/bar.mp3">
                            Foo
                          </a>
                        </div>
                      </body>
                    </html>`, "text/html")),
            };
            const expected = "http://foo.com:123/bar.mp3";

            const file = await extract(new URL(url), content);
            assert.strictEqual(file, expected);
        });
    });
});
