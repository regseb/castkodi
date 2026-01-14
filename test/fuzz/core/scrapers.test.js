/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import fc from "fast-check";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("core/scrapers.js", () => {
    describe("extract()", () => {
        it("should support URL", async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.webUrl({
                        withFragments: true,
                        withQueryParameters: true,
                    }),
                    async (url) => {
                        const file = await extract(new URL(url), {
                            depth: false,
                            incognito: false,
                        });
                        assert.equal(file, undefined);
                    },
                ),
            );
        });
    });
});
