/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
// Importer le fichier des scrapers en premier pour contourner un problème de
// dépendances circulaires.
// eslint-disable-next-line import/no-unassigned-import
import "../../../../src/core/scrapers.js";
import * as scraper from "../../../../src/core/scraper/ok.js";
import "../../setup.js";

describe("core/scraper/ok.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("extract()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://ko.ru/video/42");
            const metadata = { html: () => Promise.resolve(undefined) };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't options", async () => {
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

        it("should return URL", async () => {
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

    describe("extractMobile()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://m.ko.ru/video/42");

            const file = await scraper.extractMobile(url);
            assert.equal(file, undefined);
        });

        it("should return URL", async () => {
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
