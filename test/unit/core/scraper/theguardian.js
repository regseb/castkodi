import assert      from "assert";
import { extractVideo, extractAudio }
                             from "../../../../src/core/scraper/theguardian.js";

describe("core/scraper/theguardian.js", function () {
    describe("extractVideo()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://support.theguardian.com/eu/contribute";
            const expected = null;

            const file = await extractVideo(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not a video", async function () {
            const url = "https://www.theguardian.com/foo";
            const doc = new DOMParser().parseFromString(`
                <html>
                  <body></body>
                </html>`, "text/html");
            const options = { "incognito": false };
            const expected = null;

            const file = await extractVideo(new URL(url), doc, options);
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            const url = "https://www.theguardian.com/foo";
            const doc = new DOMParser().parseFromString(`
                <html>
                  <body>
                    <div class="youtube-media-atom__iframe"
                         data-asset-id="foo" />
                  </body>
                </html>`, "text/html");
            const options = { "incognito": false };
            const expected = "plugin://plugin.video.youtube/play/" +
                                                "?video_id=foo&incognito=false";

            const file = await extractVideo(new URL(url), doc, options);
            assert.strictEqual(file, expected);
        });

        it("should return video URL in incognito mode", async function () {
            const url = "https://www.theguardian.com/foo";
            const doc = new DOMParser().parseFromString(`
                <html>
                  <body>
                    <div class="youtube-media-atom__iframe"
                         data-asset-id="foo" />
                  </body>
                </html>`, "text/html");
            const options = { "incognito": true };
            const expected = "plugin://plugin.video.youtube/play/" +
                                                 "?video_id=foo&incognito=true";

            const file = await extractVideo(new URL(url), doc, options);
            assert.strictEqual(file, expected);
        });
    });

    describe("extractAudio()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://support.theguardian.com/eu/contribute";
            const expected = null;

            const file = await extractAudio(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not an audio", async function () {
            const url = "https://www.theguardian.com/foo";
            const doc = new DOMParser().parseFromString(`
                <html>
                  <body></body>
                </html>`, "text/html");
            const expected = null;

            const file = await extractAudio(new URL(url), doc);
            assert.strictEqual(file, expected);
        });
        it("should return audio URL", async function () {
            const url = "https://www.theguardian.com/foo";
            const doc = new DOMParser().parseFromString(`
                <html>
                  <body>
                    <figure id="audio-component-container"
                            data-source="https://foo.com/bar.mp3" />
                  </body>
                </html>`, "text/html");
            const expected = "https://foo.com/bar.mp3";

            const file = await extractAudio(new URL(url), doc);
            assert.strictEqual(file, expected);
        });
    });
});
