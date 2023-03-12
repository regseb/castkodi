/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { GUI } from "../../../../src/core/jsonrpc/gui.js";
import { Kodi } from "../../../../src/core/jsonrpc/kodi.js";

describe("core/jsonrpc/gui.js", function () {
    describe("setFullscreen()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const gui = new GUI(kodi);
            const result = await gui.setFullscreen();
            assert.equal(result, "OK");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "GUI.SetFullscreen",
                { fullscreen: "toggle" },
            ]);
        });
    });
});
