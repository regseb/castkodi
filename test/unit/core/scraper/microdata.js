/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/microdata.js";

describe("core/scraper/microdata.js", function () {
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

        it("should return undefined for unsupported type", async function () {
            const url = new URL("http://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <div itemscope
                                    itemtype="http://schema.org/Event">
                                 <meta itemprop="url"
                                       content="https://bar.com/baz.html" />
                               </div>
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined whan no url", async function () {
            const url = new URL("http://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <div itemscope
                                    itemtype="http://schema.org/VideoObject">
                                 <meta itemprop="image"
                                       content="https://bar.com/baz.png" />
                               </div>
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return URL", async function () {
            const url = new URL("http://foo.com");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <div itemscope
                                    itemtype="http://schema.org/Person">
                                 <span itemprop="name">Bar</span>
                               </div>
                               <div itemscope
                                    itemtype="http://schema.org/AudioObject">
                                 <meta itemprop="url"
                                       content="https://baz.com/qux.mp3" />
                               </div>
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://baz.com/qux.mp3");
        });
    });
});
