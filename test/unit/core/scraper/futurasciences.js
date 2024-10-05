/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
import * as scraper from "../../../../src/core/scraper/futurasciences.js";

describe("core/scraper/futurasciences.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://cdn.futura-sciences.com/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it's depth", async function () {
            const url = new URL("https://www.futura-sciences.com/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <iframe data-src="//dai.ly/bar"></iframe>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: true, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't HTML", async function () {
            const url = new URL("https://www.futura-sciences.com/favicon.png");
            const metadata = { html: () => Promise.resolve(undefined) };
            const context = { depth: false, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't iframe", async function () {
            const url = new URL("https://www.futura-sciences.com/foo");
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

        it("should return URL from iframe", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://www.futura-sciences.com/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <iframe data-src="//dai.ly/bar"></iframe>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: true };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=bar",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return URL from iframe with data-src", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://www.futura-sciences.com/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `
                    <html><body>
                      <iframe src="//dai.ly/bar"></iframe>
                      <iframe data-src="https://baz.com/qux.zip"></iframe>
                      <iframe data-src="//dai.ly/quux"></iframe>
                    </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/" +
                    "?mode=playVideo&url=quux",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return URL from vsly-player", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://www.futura-sciences.com/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <div class="vsly-player"
                                    data-iframe="//dai.ly/bar"></div>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: true };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=bar",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });
    });
});
