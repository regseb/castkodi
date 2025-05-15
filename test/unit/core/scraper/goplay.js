/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import * as scraper from "../../../../src/core/scraper/goplay.js";

describe("core/scraper/goplay.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.goplay.be/profiel");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async function () {
            const url = new URL("https://www.goplay.be/video/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            '<html lang="en"><body></body></html>',
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return video URL", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({
                        manifestUrls: { hls: "https://foo.be/bar.m3u8" },
                    }),
                ),
            );

            const url = new URL("https://www.goplay.be/video/baz");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <div data-video="${JSON.stringify({
                                   id: "qux",
                               }).replaceAll('"', "&quot;")}"></div>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://foo.be/bar.m3u8");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://api.goplay.be/web/v1/videos/short-form/qux",
            ]);
        });
    });
});
