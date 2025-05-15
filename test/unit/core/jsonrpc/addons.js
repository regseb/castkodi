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
                        { addonid: "foo", type: "bar" },
                        { addonid: "baz", type: "bar" },
                    ],
                    limits: { end: 2, start: 0, total: 2 },
                }),
            );

            const addons = new Addons(kodi);
            const result = await addons.getAddons("bar");
            assert.deepEqual(result, ["foo", "baz"]);

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Addons.GetAddons",
                { content: "bar", enabled: true },
            ]);
        });

        it("should return addons from two contents", async function () {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => {
                switch (send.mock.callCount()) {
                    case 0:
                        return Promise.resolve({
                            addons: [
                                { addonid: "foo", type: "bar" },
                                { addonid: "baz", type: "bar" },
                            ],
                            limits: { end: 2, start: 0, total: 2 },
                        });
                    case 1:
                        return Promise.resolve({
                            addons: [{ addonid: "qux", type: "quux" }],
                            limits: { end: 2, start: 0, total: 2 },
                        });
                    default:
                        throw new Error("Third unexpected call");
                }
            });

            const addons = new Addons(kodi);
            const result = await addons.getAddons("bar", "quux");
            assert.deepEqual(result, ["foo", "baz", "qux"]);

            assert.equal(send.mock.callCount(), 2);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Addons.GetAddons",
                { content: "bar", enabled: true },
            ]);
            assert.deepEqual(send.mock.calls[1].arguments, [
                "Addons.GetAddons",
                { content: "quux", enabled: true },
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
            const result = await addons.getAddons("foo");
            assert.deepEqual(result, []);

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Addons.GetAddons",
                { content: "foo", enabled: true },
            ]);
        });
    });
});
