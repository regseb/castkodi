/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import fc from "fast-check";
import { strip } from "../../../src/core/labelers.js";

describe("core/labelers.js", () => {
    describe("strip()", () => {
        it("should support text", () => {
            fc.assert(
                fc.property(fc.string(), (text) => {
                    const stripped = strip(text);

                    assert.ok(typeof stripped, "string");
                }),
            );
        });
    });
});
