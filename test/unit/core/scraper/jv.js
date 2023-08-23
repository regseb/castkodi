/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
import * as scraper from "../../../../src/core/scraper/jv.js";

describe("core/scraper/jv.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.jvlemag.com/");
            const metadata = undefined;
            const context = { depth: false, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when it's depth", async function () {
            const url = new URL("https://www.jeuxvideo.com/foo");
            const metadata = undefined;
            const context = { depth: true, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async function () {
            const url = new URL("https://www.jeuxvideo.com/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            "<html><body></body></html>",
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return video URL", async function () {
            const stubFetch = sinon
                .stub(globalThis, "fetch")
                .resolves(Response.json({ options: { video: "foo" } }));
            const stubGetAddons = sinon
                .stub(kodi.addons, "getAddons")
                .resolves([]);

            const url = new URL("https://www.jeuxvideo.com/bar");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <div data-src-video="/baz/qux.php"></div>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=foo",
            );

            assert.equal(stubFetch.callCount, 1);
            assert.deepEqual(stubFetch.firstCall.args, [
                new URL("https://www.jeuxvideo.com/baz/qux.php"),
            ]);
            assert.equal(stubGetAddons.callCount, 1);
            assert.deepEqual(stubGetAddons.firstCall.args, ["video"]);
        });
    });
});
