import assert from "assert";
import { extractVideo, extractAudio, extractYandex }
                               from "../../../../src/core/scraper/opengraph.js";

describe("core/scraper/opengraph.js", function () {
    describe("extractVideo()", function () {
        it("should return null when it's not a HTML page", async function () {
            const url = "https://foo.com";
            const content = { html: () => Promise.resolve(null) };
            const options = { depth: 0 };
            const expected = null;

            const file = await extractVideo(new URL(url), content, options);
            assert.strictEqual(file, expected);
        });

        it("should return null when there isn't Open Graph", async function () {
            const url = "https://foo.com";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head></head>
                    </html>`, "text/html")),
            };
            const options = { depth: 0 };
            const expected = null;

            const file = await extractVideo(new URL(url), content, options);
            assert.strictEqual(file, expected);
        });

        it("should return null when content is empty", async function () {
            const url = "https://foo.com";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head>
                        <meta property="og:video:type" content="video/mp4" />
                        <meta property="og:video" content="" />
                      </head>
                    </html>`, "text/html")),
            };
            const options = { depth: 0 };
            const expected = null;

            const file = await extractVideo(new URL(url), content, options);
            assert.strictEqual(file, expected);
        });

        it("should return null when type isn't supported", async function () {
            const url = "https://foo.com";
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
            const options = { depth: 0 };
            const expected = null;

            const file = await extractVideo(new URL(url), content, options);
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            const url = "https://foo.com";
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
            const options = { depth: 0 };
            const expected = "http://bar.com/baz.mkv";

            const file = await extractVideo(new URL(url), content, options);
            assert.strictEqual(file, expected);
        });

        it("should return null when it's depther", async function () {
            const url = "https://foo.com";
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
            const options = { depth: 1 };
            const expected = null;

            const file = await extractVideo(new URL(url), content, options);
            assert.strictEqual(file, expected);
        });

        it("should return plugin URL", async function () {
            const url = "https://foo.com";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head>
                        <meta property="og:video:type" content="text/html" />
                        <meta property="og:video"
                              content="https://www.youtube.com/embed/foo" />
                      </head>
                    </html>`, "text/html")),
            };
            const options = { depth: 0, incognito: true };
            const expected = "plugin://plugin.video.youtube/play/" +
                                                               "?video_id=foo" +
                                                              "&incognito=true";

            const file = await extractVideo(new URL(url), content, options);
            assert.strictEqual(file, expected);
        });
    });

    describe("extractAudio()", function () {
        it("should return null when it's not a HTML page", async function () {
            const url = "https://foo.com";
            const content = { html: () => Promise.resolve(null) };
            const options = { depth: 0 };
            const expected = null;

            const file = await extractAudio(new URL(url), content, options);
            assert.strictEqual(file, expected);
        });

        it("should return null when there isn't Open Graph", async function () {
            const url = "https://foo.com";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head></head>
                    </html>`, "text/html")),
            };
            const options = { depth: 0 };
            const expected = null;

            const file = await extractAudio(new URL(url), content, options);
            assert.strictEqual(file, expected);
        });

        it("should return null when content is empty", async function () {
            const url = "https://foo.com";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head>
                        <meta property="og:audio:type" content="audio/mpeg" />
                        <meta property="og:audio" content="" />
                      </head>
                    </html>`, "text/html")),
            };
            const options = { depth: 0 };
            const expected = null;

            const file = await extractAudio(new URL(url), content, options);
            assert.strictEqual(file, expected);
        });

        it("should return null when type isn't supported", async function () {
            const url = "https://foo.com";
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
            const options = { depth: 0 };
            const expected = null;

            const file = await extractAudio(new URL(url), content, options);
            assert.strictEqual(file, expected);
        });

        it("should return audio URL", async function () {
            const url = "https://foo.com";
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
            const options = { depth: 0 };
            const expected = "http://bar.com/baz.wav";

            const file = await extractAudio(new URL(url), content, options);
            assert.strictEqual(file, expected);
        });

        it("should return null when it's depther", async function () {
            const url = "https://foo.com";
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
            const options = { depth: 1 };
            const expected = null;

            const file = await extractAudio(new URL(url), content, options);
            assert.strictEqual(file, expected);
        });

        it("should return plugin URL", async function () {
            const url = "https://foo.com";
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
            const options = { depth: 0 };
            const expected = "plugin://plugin.audio.mixcloud/?mode=40&key=" +
                                                              "%2Ffoo%2Fbar%2F";

            const file = await extractAudio(new URL(url), content, options);
            assert.strictEqual(file, expected);
        });
    });

    describe("extractYandex()", function () {
        it("should return null when it's not a HTML page", async function () {
            const url = "https://foo.com";
            const content = { html: () => Promise.resolve(null) };
            const expected = null;

            const file = await extractYandex(new URL(url), content);
            assert.strictEqual(file, expected);
        });

        it("should return null when there isn't Open Graph", async function () {
            const url = "https://foo.com";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head></head>
                    </html>`, "text/html")),
            };
            const expected = null;

            const file = await extractYandex(new URL(url), content);
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            const url = "https://foo.com";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head>
                        <meta property="ya:ovs:content_url"
                              content="https://bar.com/baz.avi" />
                      </head>
                    </html>`, "text/html")),
            };
            const expected = "https://bar.com/baz.avi";

            const file = await extractYandex(new URL(url), content);
            assert.strictEqual(file, expected);
        });
    });
});
