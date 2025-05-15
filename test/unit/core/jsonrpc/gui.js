/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import { GUI } from "../../../../src/core/jsonrpc/gui.js";
import { Kodi } from "../../../../src/core/jsonrpc/kodi.js";

describe("core/jsonrpc/gui.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("setFullscreen()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve("OK"));

            const gui = new GUI(kodi);
            const result = await gui.setFullscreen();
            assert.equal(result, "OK");

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "GUI.SetFullscreen",
                { fullscreen: "toggle" },
            ]);
        });
    });
});
