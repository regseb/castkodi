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
            const doc = new DOMParser().parseFromString(`
                <html>
                  <body>
                    <div id="show">
                      <a href="http://stream.kcaastreaming.com:5222/kcaa.mp3">
                        Foo
                      </a>
                    </div>
                  </body>
                </html>`, "text/html");
            const expected = "http://stream.kcaastreaming.com:5222/kcaa.mp3";

            const file = await extract(new URL(url), doc);
            assert.strictEqual(file, expected);
        });
    });
});
