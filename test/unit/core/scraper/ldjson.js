/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
import * as scraper from "../../../../src/core/scraper/ldjson.js";

describe("core/scraper/ldjson.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://foo.com");
            const metadata = { html: () => Promise.resolve(undefined) };
            const context = { depth: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't microdata", async function () {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            "<html><body></body></html>",
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when JSON is invalid", async function () {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <script type="application/ld+json"></script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't type", async function () {
            const url = new URL("http://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `
                    <html><body>
                      <script type="application/ld+json">${JSON.stringify({
                          "@context": "http://schema.org/",
                          "@type": "ImageObject",
                          contentUrl: "https://bar.com/baz.png",
                      })}</script>
                    </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't content", async function () {
            const url = new URL("http://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `
                    <html><body>
                      <script type="application/ld+json">${JSON.stringify({
                          "@context": "http://schema.org/",
                          "@type": "MusicVideoObject",
                      })}</script>
                    </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return contentUrl", async function () {
            const url = new URL("http://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `
                    <html><body>
                      <script type="application/ld+json">${JSON.stringify({
                          "@context": "http://schema.org/",
                          "@type": "VideoObject",
                          contentUrl: "https://bar.com/baz.mkv",
                      })}</script>
                    </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, "https://bar.com/baz.mkv");
        });

        it("should return contentUrl in children object", async function () {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `
                    <html><body>
                      <script type="application/ld+json">${JSON.stringify({
                          "@context": "https://schema.org",
                          "@type": "RadioEpisode",
                          // eslint-disable-next-line unicorn/no-null
                          bar: null,
                          audio: {
                              "@type": "AudioObject",
                              contentUrl: "https://baz.com/qux.flac",
                          },
                      })}</script>
                    </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, "https://baz.com/qux.flac");
        });

        it("should return contentUrl in children array", async function () {
            const url = new URL("https://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `
                    <html><body>
                      <script type="application/ld+json">${JSON.stringify({
                          "@context": "https://schema.org",
                          "@graph": [
                              {
                                  "@type": "AudioObject",
                                  contentUrl: "https://bar.io/baz.mp3",
                              },
                          ],
                      })}</script>
                    </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, "https://bar.io/baz.mp3");
        });

        it("should return embedUrl", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("http://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `
                    <html><body>
                      <script type="application/ld+json">${JSON.stringify({
                          "@context": "http://schema.org/",
                          "@type": "VideoObject",
                          embedUrl: "https://unknowntube.org/embed/bar",
                      })}</script>
                      <script type="application/ld+json">${JSON.stringify({
                          "@context": "http://schema.org/",
                          "@type": "VideoObject",
                          embedUrl:
                              "https://www.dailymotion.com/embed/video/baz",
                      })}</script>
                    </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=baz",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should ignore embedUrl when it's depth", async function () {
            const url = new URL("http://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `
                    <html><body>
                      <script type="application/ld+json">${JSON.stringify({
                          "@context": "http://schema.org/",
                          "@type": "VideoObject",
                          embedUrl:
                              "https://www.dailymotion.com/embed/video/baz",
                      })}</script>
                    </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: true };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });
    });
});
