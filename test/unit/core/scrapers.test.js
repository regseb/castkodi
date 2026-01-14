/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("core/scrapers.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("extract()", () => {
        it("should return undefined when it isn't supported", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    new Response(
                        // Ajouter du contenu dans la page pour vérifier qu'il
                        // n'est pas récupéré.
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

        it("should return undefined when no Content-Type", async () => {
            const abort = mock.fn();
            const abortController = mock.property(
                globalThis,
                "AbortController",
                class {
                    signal = "foo";
                    abort = abort;
                },
            );
            const fetch = mock.method(globalThis, "fetch", () =>
                // Ne pas fournir de corps pour que l'entête "Content-Type" soit
                // nul. Sinon avec un corps, l'entête a la valeur par défaut :
                // "text/plain;charset=UTF-8".
                Promise.resolve(new Response()),
            );
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://bar.com/baz");
            const context = { depth: false, incognito: false };

            const file = await extract(url, context);
            assert.equal(file, undefined);

            assert.equal(abortController.mock.accessCount(), 1);
            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                url,
                { signal: "foo" },
            ]);
            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
            assert.equal(abort.mock.callCount(), 1);
        });

        it("should return media URL", async () => {
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

        it("should return media URL from XHTML", async () => {
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

        it("should support URL", async () => {
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

        it("should support uppercase hostname", async () => {
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
