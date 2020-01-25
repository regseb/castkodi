import assert          from "assert";
import sinon           from "sinon";
import { notify }      from "../../../src/core/notify.js";
import { PebkacError } from "../../../src/core/pebkac.js";

describe("core/notify.js", function () {
    afterEach(function () {
        sinon.restore();
    });

    describe("constructor()", function () {
        it("should accept Error", function () {
            sinon.stub(browser.notifications, "create")
                 .callsFake(() => {});
            sinon.stub(browser.i18n, "getMessage").callsFake((k) => k);

            notify(new Error("Message."));

            assert.ok(browser.notifications.create.calledOnce);
            const call = browser.notifications.create.firstCall;
            assert.strictEqual(call.args[1].title,
                               "notifications_unknown_title");
            assert.strictEqual(call.args[1].message, "Message.");
        });

        it("should accept PebkacError", function () {
            sinon.stub(browser.notifications, "create")
                 .callsFake(() => {});
            sinon.stub(browser.i18n, "getMessage").callsFake((k) => k);

            notify(new PebkacError("clef"));

            assert.ok(browser.notifications.create.calledOnce);
            const call = browser.notifications.create.firstCall;
            assert.strictEqual(call.args[1].title, "notifications_clef_title");
            assert.strictEqual(call.args[1].message,
                               "notifications_clef_message");
        });
    });
});
