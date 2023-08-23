/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import { extract } from "../../../src/core/scrapers.js";

describe("core/scrapers.js", function () {
    describe("extract()", function () {
        it("should return undefined when it isn't supported", async function () {
            const stubFetch = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    // Ajouter du contenu dans la page pour vérifier qu'il n'est
                    // pas récupéré.
                    '<audio src="foo.mp3">',
                    { headers: { "Content-Type": "application/svg+xml" } },
                ),
            );
            const stubGetAddons = sinon
                .stub(kodi.addons, "getAddons")
                .resolves([]);

            const url = new URL("https://foo.com/bar.svg");
            const context = { depth: false, incognito: false };

            const file = await extract(url, context);
            assert.equal(file, undefined);

            assert.equal(stubFetch.callCount, 1);
            assert.equal(stubFetch.firstCall.args.length, 2);
            assert.deepEqual(stubFetch.firstCall.args[0], url);
            assert.equal(typeof stubFetch.firstCall.args[1], "object");
            assert.equal(stubGetAddons.callCount, 1);
            assert.deepEqual(stubGetAddons.firstCall.args, ["video"]);
        });

        it("should return undefined when no Content-Type", async function () {
            const stubFetch = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    // Ajouter du contenu dans la page pour vérifier qu'il n'est
                    // pas récupéré.
                    '<video src="foo.mp4">',
                    { headers: { "Content-Type": undefined } },
                ),
            );
            const stubGetAddons = sinon
                .stub(kodi.addons, "getAddons")
                .resolves([]);

            const url = new URL("https://foo.com/bar");
            const context = { depth: false, incognito: false };

            const file = await extract(url, context);
            assert.equal(file, undefined);

            assert.equal(stubFetch.callCount, 1);
            assert.equal(stubFetch.firstCall.args.length, 2);
            assert.deepEqual(stubFetch.firstCall.args[0], url);
            assert.equal(typeof stubFetch.firstCall.args[1], "object");
            assert.equal(stubGetAddons.callCount, 1);
            assert.deepEqual(stubGetAddons.firstCall.args, ["video"]);
        });

        it("should return media URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    `<html><body>
                       <video src="/baz.mp4" />
                     </body></html>`,
                    { headers: { "Content-Type": "text/html;charset=utf-8" } },
                ),
            );

            const url = new URL("https://foo.com/bar.html");
            const context = { depth: false, incognito: false };

            const file = await extract(url, context);
            assert.equal(file, "https://foo.com/baz.mp4");

            assert.equal(stub.callCount, 1);
            assert.equal(stub.firstCall.args.length, 2);
            assert.deepEqual(stub.firstCall.args[0], url);
            assert.equal(typeof stub.firstCall.args[1], "object");
        });

        it("should return media URL from XHTML", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    `<html><body>
                       <video src="/foo.mp4" />
                     </body></html>`,
                    {
                        headers: {
                            "Content-Type":
                                "application/xhtml+xml;charset=utf-8",
                        },
                    },
                ),
            );

            const url = new URL("https://bar.org/baz.html");
            const context = { depth: false, incognito: false };

            const file = await extract(url, context);
            assert.equal(file, "https://bar.org/foo.mp4");

            assert.equal(stub.callCount, 1);
            assert.equal(stub.firstCall.args.length, 2);
            assert.deepEqual(stub.firstCall.args[0], url);
            assert.equal(typeof stub.firstCall.args[1], "object");
        });

        it("should support URL", async function () {
            const stubFetch = sinon
                .stub(globalThis, "fetch")
                .resolves(new Response(""));
            const stubGetAddons = sinon
                .stub(kodi.addons, "getAddons")
                .resolves([]);

            const url = new URL("http://www.dailymotion.com/video/foo");
            const context = { depth: false, incognito: false };

            const file = await extract(url, context);
            assert.ok(
                file?.startsWith("plugin://plugin.video.dailymotion_com/"),
                `"${file}"?.startsWith(...)`,
            );

            assert.equal(stubFetch.callCount, 1);
            assert.equal(stubGetAddons.callCount, 1);
            assert.deepEqual(stubGetAddons.firstCall.args, ["video"]);
        });

        it("should support uppercase URL", async function () {
            const stubFetch = sinon
                .stub(globalThis, "fetch")
                .resolves(new Response(""));
            const stubGetAddons = sinon
                .stub(kodi.addons, "getAddons")
                .resolves([]);

            const url = new URL("HTTPS://PLAYER.VIMEO.COM/VIDEO/FOO");
            const context = { depth: false, incognito: false };

            const file = await extract(url, context);
            assert.ok(
                file?.startsWith("plugin://plugin.video.vimeo/"),
                `"${file}"?.startsWith(...)`,
            );

            assert.equal(stubFetch.callCount, 1);
            assert.equal(stubGetAddons.callCount, 1);
            assert.deepEqual(stubGetAddons.firstCall.args, ["video"]);
        });
    });
});
