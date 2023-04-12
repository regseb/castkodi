/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/jv.js";

describe("core/scraper/jv.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.jvlemag.com/");
            const content = undefined;
            const options = { depth: false, incognito: false };

            const file = await scraper.extract(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return undefined when it's depth", async function () {
            const url = new URL("https://www.jeuxvideo.com/foo");
            const content = undefined;
            const options = { depth: true, incognito: false };

            const file = await scraper.extract(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async function () {
            const url = new URL("https://www.jeuxvideo.com/foo");
            const content = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            "<html><body></body></html>",
                            "text/html",
                        ),
                    ),
            };
            const options = { depth: false, incognito: false };

            const file = await scraper.extract(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return video URL", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .resolves(Response.json({ options: { video: "foo" } }));

            const url = new URL("https://www.jeuxvideo.com/bar");
            const content = {
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
            const options = { depth: false, incognito: false };

            const file = await scraper.extract(url, content, options);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                new URL("https://www.jeuxvideo.com/baz/qux.php"),
            ]);
        });
    });
});
