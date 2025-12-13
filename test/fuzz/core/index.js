/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import fc from "fast-check";
import { cast } from "../../../src/core/index.js";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";

describe("core/index.js", function () {
    describe("cast()", function () {
        afterEach(function () {
            mock.reset();
        });

        it("should reject invalid URL", async function () {
            await fc.assert(
                fc.asyncProperty(
                    fc
                        .string()
                        .filter((u) => !URL.canParse(`http://${u.trim()}`)),
                    async (url) => {
                        await assert.rejects(() => cast("send", [url]), {
                            name: "PebkacError",
                            type: "noLink",
                        });
                    },
                ),
            );
        });

        it("should support URL", async function () {
            mock.method(kodi.playlist, "add", () => Promise.resolve("OK"));

            await fc.assert(
                fc.asyncProperty(
                    fc.webUrl({
                        withFragments: true,
                        withQueryParameters: true,
                    }),
                    async (url) => {
                        const file = await cast("add", [url]);
                        assert.equal(file, undefined);
                    },
                ),
            );
        });
    });
});
