import assert      from "assert";
import { extract } from "../../../../src/core/scraper/ultimedia.js";

describe("core/scraper/ultimedia.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://www.ultimedia.com/default/presentation/cgu";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when no script", async function () {
            const url = "https://www.ultimedia.com/deliver/generic/iframe/foo";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };
            const expected = null;

            const file = await extract(new URL(url), content);
            assert.strictEqual(file, expected);
        });

        it("should return null when no inline script", async function () {
            const url = "https://www.ultimedia.com/deliver/generic/iframe/foo";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script src="https://www.ultimedia.com/script.js">` +
                                                                      `</script>
                      </body>
                    </html>`, "text/html")),
            };
            const expected = null;

            const file = await extract(new URL(url), content);
            assert.strictEqual(file, expected);
        });

        it("should return null when no station", async function () {
            const url = "https://www.ultimedia.com/deliver/generic/iframe/foo";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script>
                            DtkPlayer.init({});
                        </script>
                      </body>
                    </html>`, "text/html")),
            };
            const expected = null;

            const file = await extract(new URL(url), content);
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            const url = "https://www.ultimedia.com/deliver/generic/iframe/foo";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script>
                            DtkPlayer.init({
                                "mp4":{
                                    "mp4_1080":"https://foo.com/bar_1080.mp4",
                                    "mp4_720":"https://foo.com/bar_720.mp4"
                                }
                            });
                        </script>
                      </body>
                    </html>`, "text/html")),
            };
            const expected = "https://foo.com/bar_1080.mp4";

            const file = await extract(new URL(url), content);
            assert.strictEqual(file, expected);
        });
    });
});
