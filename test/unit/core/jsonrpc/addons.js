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
                    { addonid: "foo", type: "bar", enabled: true },
                    { addonid: "baz", type: "bar", enabled: false },
                    { addonid: "qux", type: "bar", enabled: true },
                ],
                limits: { end: 3, start: 0, total: 3 },
            });

            const addons = new Addons(kodi);
            const result = await addons.getAddons("bar");
            assert.deepStrictEqual(result, ["foo", "qux"]);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "Addons.GetAddons",
                { content: "bar", properties: ["enabled"] },
            ]);
        });
    });
});
