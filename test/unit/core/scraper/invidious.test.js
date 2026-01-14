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
import * as scraper from "../../../../src/core/scraper/invidious.js";
import "../../setup.js";

describe("core/scraper/invidious.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("extract()", () => {
        it("should return undefined when it's depth", async () => {
            const url = new URL("https://yewtu.be/watch?v=foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><head>
                               <link
                                 rel="alternate"
                                 href="https://www.youtube.com/watch?v=foo"
                               />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: true, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't HTML", async () => {
            const url = new URL("https://docs.invidious.io/");
            const metadata = { html: () => Promise.resolve(undefined) };
            const context = { depth: false, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when no link", async () => {
            const url = new URL("https://inv.nadeko.net/watch?v=foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            '<html lang="en"><head></head></html>',
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return video URL", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://invidious.nerdvpn.de/watch?v=foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><head>
                               <link
                                 rel="alternate"
                                 href="https://www.youtube.com/watch?v=foo"
                               />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: true };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/?video_id=foo&incognito=true",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });
});
