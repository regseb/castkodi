/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import { notify } from "../../../../src/core/tools/notify.js";
import { PebkacError } from "../../../../src/core/tools/pebkac.js";

describe("core/tools/notify.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("constructor()", function () {
        it("should accept Error", async function () {
            const create = mock.method(browser.notifications, "create", () =>
                Promise.resolve("foo"),
            );

            await notify(new Error("bar"));

            assert.equal(create.mock.callCount(), 1);
            assert.deepEqual(create.mock.calls[0].arguments, [
                {
                    type: "basic",
                    iconUrl: "/img/icon128.png",
                    title: "Unknown error",
                    message: "bar",
                },
            ]);
        });

        it("should accept PebkacError", async function () {
            const create = mock.method(browser.notifications, "create", () =>
                Promise.resolve("foo"),
            );

            await notify(new PebkacError("noLink", "bar"));

            assert.equal(create.mock.callCount(), 1);
            assert.deepEqual(create.mock.calls[0].arguments, [
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
