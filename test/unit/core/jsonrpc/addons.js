import assert from "node:assert";
import sinon from "sinon";
import { Addons } from "../../../../src/core/jsonrpc/addons.js";
import { Kodi } from "../../../../src/core/jsonrpc/kodi.js";

describe("core/jsonrpc/addons.js", function () {
    describe("getAddons()", function () {
        it("should return addons", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves({
                addons: [
                    { addonid: "foo", type: "bar" },
                    { addonid: "baz", type: "bar" },
                ],
                limits: { end: 2, start: 0, total: 2 },
            });

            const addons = new Addons(kodi);
            const result = await addons.getAddons("bar");
            assert.deepStrictEqual(result, ["foo", "baz"]);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "Addons.GetAddons",
                { content: "bar", enabled: true },
            ]);
        });

        it("should return no addon", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves({
                limits: { end: 0, start: 0, total: 0 },
            });

            const addons = new Addons(kodi);
            const result = await addons.getAddons("foo");
            assert.deepStrictEqual(result, []);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "Addons.GetAddons",
                { content: "foo", enabled: true },
            ]);
        });
    });
});
