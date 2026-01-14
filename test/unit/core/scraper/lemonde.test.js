/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
// Importer le fichier des scrapers en premier pour contourner un problème de
// dépendances circulaires.
// eslint-disable-next-line import/no-unassigned-import
import "../../../../src/core/scrapers.js";
import * as scraper from "../../../../src/core/scraper/lemonde.js";
import "../../setup.js";

describe("core/scraper/lemonde.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("extract()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://journal.lemonde.fr/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't youtube / dailymotion / tiktok", async () => {
            const url = new URL("https://www.lemonde.fr/foo.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            '<html lang="fr"><body></body></html>',
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when it's depth with youtube", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons");

            const url = new URL("https://www.lemonde.fr/foo.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="fr"><body>
                               <video>
                                 <source type="video/youtube"
                                         src="https://youtu.be/bar" />
                               </video>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: true, incognito: true };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);

            assert.equal(getAddons.mock.callCount(), 0);
        });

        it("should return undefined when youtube sub-page doesn't have media", async () => {
            const url = new URL("https://www.lemonde.fr/foo.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="fr"><body>
                               <video>
                                 <source type="video/youtube"
                                         src="https://youtube.com/" />
                               </video>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: true };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return URL from youtube", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.lemonde.fr/foo.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="fr"><body>
                               <video>
                                 <source type="video/youtube"
                                         src="https://youtu.be/bar" />
                               </video>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: true };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=bar&incognito=true",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return URL from dailymotion", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.lemonde.fr/foo.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="fr"><body>
                               <div data-provider="dailymotion" data-id="bar" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=bar",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return undefined when it's depth with tiktok", async () => {
            const fetch = mock.method(globalThis, "fetch");

            const url = new URL("https://www.lemonde.fr/foo.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="fr"><body>
                               <blockquote class="tiktok-embed"
                                           cite="https://www.tiktok.com/baz" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: true, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 0);
        });

        it("should return undefined when tiktok sub-page doesn't have media", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    new Response('<html lang="fr"><body></body></html>', {
                        headers: { "Content-Type": "text/html" },
                    }),
                ),
            );

            const url = new URL("https://www.lemonde.fr/foo.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="fr"><body>
                               <blockquote class="tiktok-embed"
                                           cite="https://www.tiktok.com/baz" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.equal(fetch.mock.calls[0].arguments.length, 2);
            assert.deepEqual(
                fetch.mock.calls[0].arguments[0],
                new URL("https://www.tiktok.com/baz"),
            );
            assert.equal(typeof fetch.mock.calls[0].arguments[1], "object");
        });

        it("should return URL from tiktok", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    new Response(
                        `<html lang="fr"><body>
                           <script id="__UNIVERSAL_DATA_FOR_REHYDRATION__">${JSON.stringify(
                               {
                                   __DEFAULT_SCOPE__: {
                                       "webapp.video-detail": {
                                           itemInfo: {
                                               itemStruct: {
                                                   video: {
                                                       playAddr:
                                                           "https://foo.io" +
                                                           "/bar.mp4",
                                                   },
                                               },
                                           },
                                       },
                                   },
                               },
                           )}</script>
                         </body></html>`,
                        { headers: { "Content-Type": "text/html" } },
                    ),
                ),
            );

            const url = new URL("https://www.lemonde.fr/baz.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="fr"><body>
                               <blockquote class="tiktok-embed"
                                           cite="https://www.tiktok.com/qux" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, "https://foo.io/bar.mp4");

            assert.equal(fetch.mock.callCount(), 1);
            assert.equal(fetch.mock.calls[0].arguments.length, 2);
            assert.deepEqual(
                fetch.mock.calls[0].arguments[0],
                new URL("https://www.tiktok.com/qux"),
            );
            assert.equal(typeof fetch.mock.calls[0].arguments[1], "object");
        });
    });
});
