import assert from "node:assert";
import sinon from "sinon";

describe("core/kodi.js", function () {
    describe("handleChange()", function () {
        it("should close connexion with kodi", async function () {
            // Charger le module pour que celui-ci est l'auditeur.
            const { kodi } = await import("../../../src/core/kodi.js?" +
                                                                    Date.now());
            browser.storage.local.set({ "server-active": 0 });
            const stub = sinon.stub(kodi, "close");

            // Modifier la configuration pour que l'auditeur handleChange() soit
            // appelé.
            browser.storage.local.set({ "server-active": 1 });

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, []);
        });
    });
});
