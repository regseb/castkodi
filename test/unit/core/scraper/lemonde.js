/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
import * as scraper from "../../../../src/core/scraper/lemonde.js";

describe("core/scraper/lemonde.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://journal.lemonde.fr/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it(
            "should return undefined when there isn't youtube / dailymotion" +
                " / tiktok",
            async function () {
                const url = new URL("https://www.lemonde.fr/foo.html");
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
            },
        );

        it("should return undefined when it's depth with youtube", async function () {
            const spy = sinon.spy(kodi.addons, "getAddons");

            const url = new URL("https://www.lemonde.fr/foo.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
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

            assert.equal(spy.callCount, 0);
        });

        it("should return undefined when youtube sub-page doesn't have media", async function () {
            const url = new URL("https://www.lemonde.fr/foo.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
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

        it("should return URL from youtube", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://www.lemonde.fr/foo.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
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

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return URL from dailymotion", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://www.lemonde.fr/foo.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
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

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return undefined when it's depth with tiktok", async function () {
            const spy = sinon.spy(globalThis, "fetch");

            const url = new URL("https://www.lemonde.fr/foo.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
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

            assert.equal(spy.callCount, 0);
        });

        it("should return undefined when tiktok sub-page doesn't have media", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                new Response("<html><body></body></html>", {
                    headers: { "Content-Type": "text/html" },
                }),
            );

            const url = new URL("https://www.lemonde.fr/foo.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
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

            assert.equal(stub.callCount, 1);
            assert.equal(stub.firstCall.args.length, 2);
            assert.deepEqual(
                stub.firstCall.args[0],
                new URL("https://www.tiktok.com/baz"),
            );
            assert.equal(typeof stub.firstCall.args[1], "object");
        });

        it("should return URL from tiktok", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    `<html><body>
                       <script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"
                       >${JSON.stringify({
                           __DEFAULT_SCOPE__: {
                               "webapp.video-detail": {
                                   itemInfo: {
                                       itemStruct: {
                                           video: {
                                               playAddr:
                                                   "https://foo.io/bar.mp4",
                                           },
                                       },
                                   },
                               },
                           },
                       })}</script>
                     </body></html>`,
                    { headers: { "Content-Type": "text/html" } },
                ),
            );

            const url = new URL("https://www.lemonde.fr/baz.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
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

            assert.equal(stub.callCount, 1);
            assert.equal(stub.firstCall.args.length, 2);
            assert.deepEqual(
                stub.firstCall.args[0],
                new URL("https://www.tiktok.com/qux"),
            );
            assert.equal(typeof stub.firstCall.args[1], "object");
        });
    });
});
