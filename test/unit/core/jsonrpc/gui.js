import assert  from "assert";
import sinon   from "sinon";
import { GUI } from "../../../../src/core/jsonrpc/gui.js";

describe("core/jsonrpc/gui.js", function () {
    describe("setFullscreen()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");

            const gui = new GUI({ send: fake });
            const result = await gui.setFullscreen();
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "GUI.SetFullscreen",
                { fullscreen: "toggle" },
            ]);
        });
    });
});
