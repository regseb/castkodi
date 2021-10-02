import assert from "node:assert";
import * as scraper from "../../../../src/core/scraper/media.js";

describe("core/scraper/media.js", function () {
    describe("extract()", function () {
        it("should return null when it's not a HTML page", async function () {
            const url = new URL("https://foo.com");
            const content = { html: () => Promise.resolve(null) };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return null when there isn't video or audio",
                                                             async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return null when src is invalid", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <video src />
                        <video src="" />
                        <video src="blob:https://foo.com/bar">
                          <source src />
                          <source src="" />
                          <source src="blob:https://foo.com/baz">
                        </video>
                        <audio src />
                        <audio src="" />
                          <source src />
                          <source src="" />
                          <source src="blob:https://foo.com/qux">
                        </audio>
                        <audio src="blob:https://foo.com/quux">
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <video src="/bar.mp4" />
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, "https://foo.com/bar.mp4");
        });

        it("should return video URL from second video", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <video src="" />
                        <video src="/bar.mp4" />
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, "https://foo.com/bar.mp4");
        });

        it("should return video URL from first source", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <video src="/bar.mp4" />
                        <video>
                          <source src="/baz.mkv" />
                        </video>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, "https://foo.com/baz.mkv");
        });

        it("should return audio URL", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <audio src="/bar.mp3" />
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, "https://foo.com/bar.mp3");
        });

        it("should return audio URL from second audio", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <audio src="blob:https://foo.com/bar" />
                        <audio src="/baz.flac" />
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, "https://foo.com/baz.flac");
        });

        it("should return audio URL from first source", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <audio src="/bar.mp3" />
                        <audio>
                          <source src="/baz.wav" />
                        </audioo>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, "https://foo.com/baz.wav");
        });
    });
});
