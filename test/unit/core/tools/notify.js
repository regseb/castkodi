/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { notify } from "../../../../src/core/tools/notify.js";
import { PebkacError } from "../../../../src/core/tools/pebkac.js";

describe("core/tools/notify.js", function () {
    describe("constructor()", function () {
        it("should accept Error", async function () {
            const stub = sinon
                .stub(browser.notifications, "create")
                .resolves("foo");

            await notify(new Error("bar"));

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                {
                    type: "basic",
                    iconUrl: "/img/icon128.png",
                    title: "Unknown error",
                    message: "bar",
                },
            ]);
        });

        it("should accept PebkacError", async function () {
            const stub = sinon
                .stub(browser.notifications, "create")
                .resolves("foo");

            await notify(new PebkacError("noLink", "bar"));

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                {
                    type: "basic",
                    iconUrl: "/img/icon128.png",
                    title: "Unsupported link",
                    message: "Link bar is invalid.",
                },
            ]);
        });
    });
});
