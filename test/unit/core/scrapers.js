/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import { extract } from "../../../src/core/scrapers.js";

describe("core/scrapers.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extract()", function () {
        it("should return undefined when it isn't supported", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    new Response(
                        // Ajouter du contenu dans la page pour vérifier qu'il n'est
                        // pas récupéré.
                        '<audio src="foo.mp3">',
                        { headers: { "Content-Type": "application/svg+xml" } },
                    ),
                ),
            );
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://foo.com/bar.svg");
            const context = { depth: false, incognito: false };

            const file = await extract(url, context);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.equal(fetch.mock.calls[0].arguments.length, 2);
            assert.deepEqual(fetch.mock.calls[0].arguments[0], url);
            assert.equal(typeof fetch.mock.calls[0].arguments[1], "object");
            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return undefined when no Content-Type", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    new Response(
                        // Ajouter du contenu dans la page pour vérifier qu'il n'est
                        // pas récupéré.
                        '<video src="foo.mp4">',
                        { headers: { "Content-Type": undefined } },
                    ),
                ),
            );
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://foo.com/bar");
            const context = { depth: false, incognito: false };

            const file = await extract(url, context);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.equal(fetch.mock.calls[0].arguments.length, 2);
            assert.deepEqual(fetch.mock.calls[0].arguments[0], url);
            assert.equal(typeof fetch.mock.calls[0].arguments[1], "object");
            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return media URL", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    new Response(
                        `<html lang="en"><body>
                           <video src="/baz.mp4" />
                         </body></html>`,
                        {
                            headers: {
                                "Content-Type": "text/html;charset=utf-8",
                            },
                        },
                    ),
                ),
            );

            const url = new URL("https://foo.com/bar.html");
            const context = { depth: false, incognito: false };

            const file = await extract(url, context);
            assert.equal(file, "https://foo.com/baz.mp4");

            assert.equal(fetch.mock.callCount(), 1);
            assert.equal(fetch.mock.calls[0].arguments.length, 2);
            assert.deepEqual(fetch.mock.calls[0].arguments[0], url);
            assert.equal(typeof fetch.mock.calls[0].arguments[1], "object");
        });

        it("should return media URL from XHTML", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    new Response(
                        `<html lang="en"><body>
                           <video src="/foo.mp4" />
                         </body></html>`,
                        {
                            headers: {
                                "Content-Type":
                                    "application/xhtml+xml;charset=utf-8",
                            },
                        },
                    ),
                ),
            );

            const url = new URL("https://bar.org/baz.html");
            const context = { depth: false, incognito: false };

            const file = await extract(url, context);
            assert.equal(file, "https://bar.org/foo.mp4");

            assert.equal(fetch.mock.callCount(), 1);
            assert.equal(fetch.mock.calls[0].arguments.length, 2);
            assert.deepEqual(fetch.mock.calls[0].arguments[0], url);
            assert.equal(typeof fetch.mock.calls[0].arguments[1], "object");
        });

        it("should support URL", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.dailymotion.com/video/foo");
            const context = { depth: false, incognito: false };

            const file = await extract(url, context);
            assert.ok(
                file?.startsWith("plugin://plugin.video.dailymotion_com/"),
                `"${file}"?.startsWith(...)`,
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should support uppercase hostname", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("HTTPS://PLAYER.VIMEO.COM/video/foo");
            const context = { depth: false, incognito: false };

            const file = await extract(url, context);
            assert.ok(
                file?.startsWith("plugin://plugin.video.vimeo/"),
                `"${file}"?.startsWith(...)`,
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });
});
