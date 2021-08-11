import assert from "node:assert";
import sinon from "sinon";
import { notify } from "../../../src/core/notify.js";
import { PebkacError } from "../../../src/core/pebkac.js";

describe("core/notify.js", function () {
    describe("constructor()", function () {
        it("should accept Error", function () {
            const stub = sinon.stub(browser.notifications, "create");

            notify(new Error("foo"));

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [{
                type:    "basic",
                iconUrl: "/img/icon.svg",
                title:   "Unknown error",
                message: "foo",
            }]);

            stub.restore();
        });

        it("should accept PebkacError", function () {
            const stub = sinon.stub(browser.notifications, "create");

            notify(new PebkacError("noLink", "foo"));

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [{
                type:    "basic",
                iconUrl: "/img/icon.svg",
                title:   "Unsupported link",
                message: "Link foo is invalid.",
            }]);

            stub.restore();
        });
    });
});
