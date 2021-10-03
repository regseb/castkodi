import assert from "node:assert";
import * as scraper from "../../../../src/core/scraper/opengraph.js";

describe("core/scraper/opengraph.js", function () {
    describe("extractVideo()", function () {
        it("should return null when it's not a HTML page", async function () {
            const url = new URL("https://foo.com");
            const content = { html: () => Promise.resolve(null) };
            const options = { depth: false };

            const file = await scraper.extractVideo(url, content, options);
            assert.strictEqual(file, null);
        });

        it("should return null when there isn't Open Graph", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head></head>
                    </html>`, "text/html")),
            };
            const options = { depth: false };

            const file = await scraper.extractVideo(url, content, options);
            assert.strictEqual(file, null);
        });

        it("should return null when content is empty", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head>
                        <meta property="og:video:type" content="video/mp4" />
                        <meta property="og:video" content="" />
                      </head>
                    </html>`, "text/html")),
            };
            const options = { depth: false };

            const file = await scraper.extractVideo(url, content, options);
            assert.strictEqual(file, null);
        });

        it("should return null when type isn't supported", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head>
                        <meta property="og:video:type"
                              content="application/pdf" />
                        <meta property="og:video"
                              content="http://bar.com/baz.pdf" />
                      </head>
                    </html>`, "text/html")),
            };
            const options = { depth: false };

            const file = await scraper.extractVideo(url, content, options);
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head>
                        <meta property="og:video:type" content="video/web" />
                        <meta property="og:video"
                              content="http://bar.com/baz.mkv" />
                      </head>
                    </html>`, "text/html")),
            };
            const options = { depth: false };

            const file = await scraper.extractVideo(url, content, options);
            assert.strictEqual(file, "http://bar.com/baz.mkv");
        });

        it("should return null when it's depther", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head>
                        <meta property="og:video:type" content="text/html" />
                        <meta property="og:video"
                              content="http://bar.com/baz.html" />
                      </head>
                    </html>`, "text/html")),
            };
            const options = { depth: true };

            const file = await scraper.extractVideo(url, content, options);
            assert.strictEqual(file, null);
        });

        it("should return plugin URL", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head>
                        <meta property="og:video:type" content="text/html" />
                        <meta property="og:video"
                              content="https://www.twitch.tv/foo" />
                      </head>
                    </html>`, "text/html")),
            };
            const options = { depth: false, incognito: true };

            const file = await scraper.extractVideo(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo");
        });
    });

    describe("extractAudio()", function () {
        it("should return null when it's not a HTML page", async function () {
            const url = new URL("https://foo.com");
            const content = { html: () => Promise.resolve(null) };
            const options = { depth: false };

            const file = await scraper.extractAudio(url, content, options);
            assert.strictEqual(file, null);
        });

        it("should return null when there isn't Open Graph", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head></head>
                    </html>`, "text/html")),
            };
            const options = { depth: false };

            const file = await scraper.extractAudio(url, content, options);
            assert.strictEqual(file, null);
        });

        it("should return null when content is empty", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head>
                        <meta property="og:audio:type" content="audio/mpeg" />
                        <meta property="og:audio" content="" />
                      </head>
                    </html>`, "text/html")),
            };
            const options = { depth: false };

            const file = await scraper.extractAudio(url, content, options);
            assert.strictEqual(file, null);
        });

        it("should return null when type isn't supported", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head>
                        <meta property="og:audio:type"
                              content="application/pdf" />
                        <meta property="og:audio"
                              content="http://bar.com/baz.pdf" />
                      </head>
                    </html>`, "text/html")),
            };
            const options = { depth: false };

            const file = await scraper.extractAudio(url, content, options);
            assert.strictEqual(file, null);
        });

        it("should return audio URL", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head>
                        <meta property="og:audio:type" content="audio/x-wav" />
                        <meta property="og:audio:secure_url"
                              content="http://bar.com/baz.wav" />
                      </head>
                    </html>`, "text/html")),
            };
            const options = { depth: false };

            const file = await scraper.extractAudio(url, content, options);
            assert.strictEqual(file, "http://bar.com/baz.wav");
        });

        it("should return null when it's depther", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head>
                        <meta property="og:audio:type" content="text/html" />
                        <meta property="og:audio"
                              content="http://bar.com/baz.html" />
                      </head>
                    </html>`, "text/html")),
            };
            const options = { depth: true };

            const file = await scraper.extractAudio(url, content, options);
            assert.strictEqual(file, null);
        });

        it("should return plugin URL", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head>
                        <meta property="og:audio:type" content="text/html" />
                        <meta property="og:audio"
                              content="https://www.mixcloud.com/foo/bar/" />
                      </head>
                    </html>`, "text/html")),
            };
            const options = { depth: false };

            const file = await scraper.extractAudio(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.audio.mixcloud/?mode=40&key=%2Ffoo%2Fbar%2F");
        });
    });

    describe("extractYandex()", function () {
        it("should return null when it's not a HTML page", async function () {
            const url = new URL("https://foo.com");
            const content = { html: () => Promise.resolve(null) };

            const file = await scraper.extractYandex(url, content);
            assert.strictEqual(file, null);
        });

        it("should return null when there isn't Open Graph", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head></head>
                    </html>`, "text/html")),
            };

            const file = await scraper.extractYandex(url, content);
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const url = new URL("https://foo.com");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head>
                        <meta property="ya:ovs:content_url"
                              content="https://bar.com/baz.avi" />
                      </head>
                    </html>`, "text/html")),
            };

            const file = await scraper.extractYandex(url, content);
            assert.strictEqual(file, "https://bar.com/baz.avi");
        });
    });
});
