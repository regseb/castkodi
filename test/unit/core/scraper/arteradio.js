import assert      from "assert";
import { extract } from "../../../../src/core/scraper/arteradio.js";

describe("core/scraper/arteradio.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://www.arteradio.com/content/au_hasard";

            const file = await extract(new URL(url));
            assert.strictEqual(file, null);
        });

        it("should return audio URL", async function () {
            const url = "https://www.arteradio.com/son/foo";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <article class="cover">
                          <button data-sound-href="foo.mp3"></button>
                        </article>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await extract(new URL(url), content);
            assert.strictEqual(file,
                "https://download.www.arte.tv/permanent" +
                                 "/arteradio/sites/default/files/sons/foo.mp3");
        });
    });
});
