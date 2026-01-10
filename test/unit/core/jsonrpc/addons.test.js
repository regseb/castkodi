/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import { Addons } from "../../../../src/core/jsonrpc/addons.js";
import { Kodi } from "../../../../src/core/jsonrpc/kodi.js";

describe("core/jsonrpc/addons.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("getAddons()", function () {
        it("should return addons", async function () {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () =>
                Promise.resolve({
                    addons: [
                        { addonid: "foo", author: "bar", type: "baz" },
                        { addonid: "qux", author: "quux", type: "baz" },
                    ],
                    limits: { end: 2, start: 0, total: 2 },
                }),
            );

            const addons = new Addons(kodi);
            const result = await addons.getAddons("video");
            assert.deepEqual(result, [
                { addonid: "foo", author: "bar", type: "baz" },
                { addonid: "qux", author: "quux", type: "baz" },
            ]);

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Addons.GetAddons",
                { content: "video", enabled: true, properties: ["author"] },
            ]);
        });

        it("should return addons from two contents", async function () {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => {
                switch (send.mock.callCount()) {
                    case 0:
                        return Promise.resolve({
                            addons: [
                                { addonid: "foo", author: "bar", type: "baz" },
                                { addonid: "qux", author: "quux", type: "baz" },
                            ],
                            limits: { end: 2, start: 0, total: 2 },
                        });
                    case 1:
                        return Promise.resolve({
                            addons: [{ addonid: "corge", type: "grault" }],
                            limits: { end: 1, start: 0, total: 1 },
                        });
                    default:
                        throw new Error("Third unexpected call");
                }
            });

            const addons = new Addons(kodi);
            const result = await addons.getAddons("video", "audio");
            assert.deepEqual(result, [
                { addonid: "foo", author: "bar", type: "baz" },
                { addonid: "qux", author: "quux", type: "baz" },
                { addonid: "corge", type: "grault" },
            ]);

            assert.equal(send.mock.callCount(), 2);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Addons.GetAddons",
                { content: "video", enabled: true, properties: ["author"] },
            ]);
            assert.deepEqual(send.mock.calls[1].arguments, [
                "Addons.GetAddons",
                { content: "audio", enabled: true, properties: ["author"] },
            ]);
        });

        it("should return no addon", async function () {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () =>
                Promise.resolve({
                    limits: { end: 0, start: 0, total: 0 },
                }),
            );

            const addons = new Addons(kodi);
            const result = await addons.getAddons("video");
            assert.deepEqual(result, []);

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Addons.GetAddons",
                { content: "video", enabled: true, properties: ["author"] },
            ]);
        });
    });
});
