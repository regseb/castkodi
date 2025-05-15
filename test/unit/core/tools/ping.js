/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import { ping } from "../../../../src/core/tools/ping.js";

describe("core/tools/ping.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("ping()", function () {
        it("should return true", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(),
            );

            const ok = await ping("https://foo.com/");
            assert.equal(ok, true);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://foo.com/",
                {
                    method: "HEAD",
                    credentials: "omit",
                },
            ]);
        });

        it("should return false", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.reject(new Error("foo")),
            );

            const ok = await ping("https://bar.com/");
            assert.equal(ok, false);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://bar.com/",
                {
                    method: "HEAD",
                    credentials: "omit",
                },
            ]);
        });
    });
});
