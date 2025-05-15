/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import * as scraper from "../../../../src/core/scraper/francetv.js";

describe("core/scraper/francetv.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL(
                "https://www.francetelevisions.fr/et-vous/programme-tv",
            );

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async function () {
            const url = new URL("https://www.france.tv/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="fr"><body>
                               <script></script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return video URL", async function () {
            const fetch = mock.method(globalThis, "fetch", () => {
                switch (fetch.mock.callCount()) {
                    case 0:
                        return Promise.resolve(
                            Response.json({
                                video: { url: "https://foo.fr/" },
                            }),
                        );
                    case 1:
                        return Promise.resolve(
                            Response.json({ url: "https://bar.fr/baz.mpd" }),
                        );
                    default:
                        throw new Error("Third unexpected call");
                }
            });

            const url = new URL("https://www.france.tv/qux");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="fr"><body>
                               <script>
                                 var FTVPlayerVideos = [{
                                   "contentId":1143295,
                                   "videoId":"123-abc"
                                 }];
                               </script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(
                file,
                "https://bar.fr/baz.mpd|User-Agent=" +
                    encodeURIComponent(navigator.userAgent),
            );

            assert.equal(fetch.mock.callCount(), 2);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://k7.ftven.fr/videos/123-abc" +
                    "?domain=www.france.tv&device_type=mobile&browser=safari",
            ]);
            assert.deepEqual(fetch.mock.calls[1].arguments, [
                "https://hdfauth.ftven.fr/esi/TA" +
                    "?format=json&url=https%3A%2F%2Ffoo.fr%2F",
            ]);
        });
    });
});
