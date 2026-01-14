/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
// Importer le fichier des scrapers en premier pour contourner un problème de
// dépendances circulaires.
// eslint-disable-next-line import/no-unassigned-import
import "../../../../src/core/scrapers.js";
import * as scraper from "../../../../src/core/scraper/allocine.js";
import "../../setup.js";

describe("core/scraper/allocine.js", () => {
    describe("extract()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://secure.allocine.fr/account");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it's depth", async () => {
            const url = new URL("https://www.allocine.fr/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="fr"><body>
                               <figure data-model="${JSON.stringify({
                                   videos: [{ idDailymotion: "bar" }],
                               }).replaceAll('"', "&quot;")}"></figure>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: true, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async () => {
            const url = new URL("https://www.allocine.fr/foo");
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

        it("should return video id", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.allocine.fr/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="fr"><body>
                               <figure data-model="${JSON.stringify({
                                   videos: [{ idDailymotion: "bar" }],
                               }).replaceAll('"', "&quot;")}"></figure>
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
    });
});
