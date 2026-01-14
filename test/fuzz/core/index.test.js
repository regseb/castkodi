/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import fc from "fast-check";
import { cast } from "../../../src/core/index.js";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import "../setup.js";

describe("core/index.js", () => {
    describe("cast()", () => {
        afterEach(() => {
            mock.reset();
        });

        it("should reject invalid URL", async () => {
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

        it("should support URL", async () => {
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
