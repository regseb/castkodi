import assert from "node:assert";
import * as scraper from "../../../../src/core/scraper/allocine.js";

describe("core/scraper/allocine.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("https://secure.allocine.fr/account");

            const file = await scraper.extract(url);
            assert.strictEqual(file, undefined);
        });

        it("should return undefined when it's not a video", async function () {
            const url = new URL("https://www.allocine.fr/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, undefined);
        });

        it("should return high video URL", async function () {
            const url = new URL("https://www.allocine.fr/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <figure data-model="${JSON.stringify({
                            videos: [{
                                sources: {
                                    high:     "https://bar.com/baz.mkv",
                                    low:      "https://bar.com/qux.wmv",
                                    medium:   "https://bar.com/quux.avi",
                                    standard: "https://bar.com/corge.mp4",
                                },
                            }],
                        }).replaceAll(`"`, "&quot;")}"></figure>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, "https://bar.com/baz.mkv");
        });

        it("should return standard video URL", async function () {
            const url = new URL("https://www.allocine.fr/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <figure data-model="${JSON.stringify({
                            videos: [{
                                sources: {
                                    low:      "https://bar.com/baz.wmv",
                                    medium:   "https://bar.com/qux.avi",
                                    standard: "https://bar.com/quux.mp4",
                                },
                            }],
                        }).replaceAll(`"`, "&quot;")}"></figure>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, "https://bar.com/quux.mp4");
        });

        it("should return medium video URL", async function () {
            const url = new URL("https://www.allocine.fr/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <figure data-model="${JSON.stringify({
                            videos: [{
                                sources: {
                                    low:    "https://bar.com/baz.wmv",
                                    medium: "https://bar.com/qux.avi",
                                },
                            }],
                        }).replaceAll(`"`, "&quot;")}"></figure>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, "https://bar.com/qux.avi");
        });

        it("should return low video URL", async function () {
            const url = new URL("https://www.allocine.fr/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <figure data-model="${JSON.stringify({
                            videos: [{
                                sources: { low: "https://bar.com/baz.wmv" },
                            }],
                        }).replaceAll(`"`, "&quot;")}"></figure>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, "https://bar.com/baz.wmv");
        });

        it("should return undefined when there isn't video", async function () {
            const url = new URL("https://www.allocine.fr/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <figure data-model="${JSON.stringify({
                            videos: [{ sources: {} }],
                        }).replaceAll(`"`, "&quot;")}"></figure>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, undefined);
        });

        it("should return video URL with protocol", async function () {
            const url = new URL("https://www.allocine.fr/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <figure data-model="${JSON.stringify({
                            videos: [{
                                sources: { high: "//bar.com/baz.mkv" },
                            }],
                        }).replaceAll(`"`, "&quot;")}"></figure>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, "https://bar.com/baz.mkv");
        });
    });
});
