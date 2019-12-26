import assert      from "assert";
import { extract } from "../../../../src/core/scraper/arteradio.js";

describe("core/scraper/arteradio.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://www.arteradio.com/content/au_hasard";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return audio URL", async function () {
            const url = "https://www.arteradio.com/son/foo";
            const doc = new DOMParser().parseFromString(`
                <html>
                  <body>
                    <article class="cover">
                      <button data-sound-href="foo.mp3"></button>
                    </article>
                  </body>
                </html>`, "text/html");
            const expected = "https://download.www.arte.tv/permanent" +
                                  "/arteradio/sites/default/files/sons/foo.mp3";

            const file = await extract(new URL(url), doc);
            assert.strictEqual(file, expected);
        });
    });
});
