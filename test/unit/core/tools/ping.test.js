/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import { ping } from "../../../../src/core/tools/ping.js";
import "../../setup.js";

describe("core/tools/ping.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("ping()", () => {
        it("should return true", async () => {
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

        it("should return false", async () => {
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
