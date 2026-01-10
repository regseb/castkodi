/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import * as scraper from "../../../../src/core/scraper/ok.js";

describe("core/scraper/ok.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://ko.ru/video/42");
            const metadata = { html: () => Promise.resolve(undefined) };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't options", async function () {
            const url = new URL("https://ok.ru/video/42");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            '<html lang="ru"><body></body></html>',
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return URL", async function () {
            const url = new URL("https://ok.ru/video/42");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="ru"><body>
                               <div data-options="${JSON.stringify({
                                   flashvars: {
                                       metadata: JSON.stringify({
                                           hlsManifestUrl:
                                               "https://foo.ru/video.m3u8",
                                       }),
                                   },
                               }).replaceAll('"', "&quot;")}" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://foo.ru/video.m3u8");
        });
    });

    describe("extractMobile()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://m.ko.ru/video/42");

            const file = await scraper.extractMobile(url);
            assert.equal(file, undefined);
        });

        it("should return URL", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    new Response(
                        `<html lang="ru"><body>
                           <div data-options="${JSON.stringify({
                               flashvars: {
                                   metadata: JSON.stringify({
                                       hlsManifestUrl:
                                           "https://foo.ru/video.m3u8",
                                   }),
                               },
                           }).replaceAll('"', "&quot;")}" />
                         </body></html>`,
                        { headers: { "Content-Type": "text/html" } },
                    ),
                ),
            );

            const url = new URL("https://m.ok.ru/video/42");

            const file = await scraper.extractMobile(url);
            assert.equal(file, "https://foo.ru/video.m3u8");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(
                fetch.mock.calls[0].arguments[0],
                new URL("https://ok.ru/video/42"),
            );
        });
    });
});
