import assert from "node:assert/strict";
import sinon from "sinon";
import { notify } from "../../../../src/core/tools/notify.js";
import { PebkacError } from "../../../../src/core/tools/pebkac.js";

describe("core/notify.js", function () {
    describe("constructor()", function () {
        it("should accept Error", function () {
            const stub = sinon.stub(browser.notifications, "create");

            notify(new Error("foo"));

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [{
                type:    "basic",
                iconUrl: "/img/icon.svg",
                title:   "Unknown error",
                message: "foo",
            }]);
        });

        it("should accept PebkacError", function () {
            const stub = sinon.stub(browser.notifications, "create");

            notify(new PebkacError("noLink", "foo"));

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [{
                type:    "basic",
                iconUrl: "/img/icon.svg",
                title:   "Unsupported link",
                message: "Link foo is invalid.",
            }]);
        });
    });
});
