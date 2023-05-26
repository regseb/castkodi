/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/francetv.js";

describe("core/scraper/francetv.js", function () {
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
                            `<html><body>
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
            const stub = sinon
                .stub(globalThis, "fetch")
                .onFirstCall()
                .resolves(
                    Response.json({
                        video: { token: "https://foo.fr/" },
                    }),
                )
                .onSecondCall()
                .resolves(
                    Response.json({
                        url: "https://bar.fr/baz.mpd",
                    }),
                );

            const url = new URL("https://www.france.tv/qux");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
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
            assert.equal(file, "https://bar.fr/baz.mpd");

            assert.equal(stub.callCount, 2);
            assert.deepEqual(stub.firstCall.args, [
                "https://player.webservices.francetelevisions.fr/v1/videos" +
                    "/123-abc?device_type=desktop&browser=firefox",
            ]);
            assert.deepEqual(stub.secondCall.args, ["https://foo.fr/"]);
        });
    });
});
