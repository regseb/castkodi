/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fc from "fast-check";
import { extract } from "../../../src/core/scrapers.js";

describe("core/scrapers.js", function () {
    describe("extract()", function () {
        it("should support URL", async function () {
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
