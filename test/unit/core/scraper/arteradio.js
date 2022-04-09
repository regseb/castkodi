import assert from "node:assert";
import * as scraper from "../../../../src/core/scraper/arteradio.js";

describe("core/scraper/arteradio.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("https://www.arteradio.com/content/au_hasard");

            const file = await scraper.extract(url);
            assert.strictEqual(file, undefined);
        });

        it("should return audio URL", async function () {
            const url = new URL("https://www.arteradio.com/son/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <article class="cover">
                          <button data-sound-href="bar.mp3"></button>
                        </article>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file,
                "https://download.www.arte.tv/permanent/arteradio/sites" +
                                                 "/default/files/sons/bar.mp3");
        });
    });
});
