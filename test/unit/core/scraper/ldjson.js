import assert      from "assert";
import { extract } from "../../../../src/core/scraper/ldjson.js";

describe("core/scraper/ldjson.js", function () {
    describe("extract()", function () {
        it("should return null when it's not a HTML page", async function () {
            const url = "https://foo.com";
            const content = { html: () => Promise.resolve(null) };
            const options = { depth: false };

            const file = await extract(new URL(url), content, options);
            assert.strictEqual(file, null);
        });

        it("should return null when there is not microdata", async function () {
            const url = "https://foo.com";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };
            const options = { depth: false };

            const file = await extract(new URL(url), content, options);
            assert.strictEqual(file, null);
        });

        it("should return null when JSON is invalid", async function () {
            const url = "https://foo.com";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script type="application/ld+json"></script>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: false };

            const file = await extract(new URL(url), content, options);
            assert.strictEqual(file, null);
        });

        it("should return null when there isn't type", async function () {
            const url = "http://foo.com";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script type="application/ld+json">{
                            "@context":   "http://schema.org/",
                            "@type":      "ImageObject",
                            "contentUrl": "https://bar.com/baz.png"
                        }</script>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: false };

            const file = await extract(new URL(url), content, options);
            assert.strictEqual(file, null);
        });

        it("should return null when there isn't content", async function () {
            const url = "http://foo.com";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script type="application/ld+json">{
                            "@context": "http://schema.org/",
                            "@type":    "MusicVideoObject"
                        }</script>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: false };

            const file = await extract(new URL(url), content, options);
            assert.strictEqual(file, null);
        });

        it("should return contentUrl", async function () {
            const url = "http://foo.com";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script type="application/ld+json">{
                            "@context":   "http://schema.org/",
                            "@type":      "VideoObject",
                            "contentUrl": "https://bar.com/baz.mkv"
                        }</script>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: false };

            const file = await extract(new URL(url), content, options);
            assert.strictEqual(file, "https://bar.com/baz.mkv");
        });

        it("should return contentUrl in children object", async function () {
            const url = "https://foo.com";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script type="application/ld+json">{
                            "@context": "https://schema.org",
                            "@type":    "RadioEpisode",
                            "audio":    {
                                "@type":      "AudioObject",
                                "contentUrl": "https://bar.com/baz.flac"
                            }
                        }</script>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: false };

            const file = await extract(new URL(url), content, options);
            assert.strictEqual(file, "https://bar.com/baz.flac");
        });

        it("should return embedUrl", async function () {
            const url = "http://foo.com";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script type="application/ld+json">{
                            "@context":"http://schema.org/",
                            "@type":"VideoObject",
                            "embedUrl":"https://unknowntube.org/embed/bar"
                        }</script>
                        <script type="application/ld+json">{
                            "@context":"http://schema.org/",
                            "@type":"VideoObject",
                            "embedUrl":"https://www.dailymotion.com/embed` +
                                                                    `/video/baz"
                        }</script>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: false };

            const file = await extract(new URL(url), content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo" +
                                                                    "&url=baz");
        });

        it("should ignore embedUrl in depther", async function () {
            const url = "http://foo.com";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script type="application/ld+json">{
                            "@context":"http://schema.org/",
                            "@type":"VideoObject",
                            "embedUrl":"https://www.dailymotion.com/embed` +
                                                                    `/video/baz"
                        }</script>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: true };

            const file = await extract(new URL(url), content, options);
            assert.strictEqual(file, null);
        });
    });
});
