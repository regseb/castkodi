/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as plugin from "../../../../src/core/plugin/piped.js";
import "../../setup.js";

describe("core/plugin/piped.js", () => {
    describe("generateUrl()", () => {
        it("should return Piped URL", () => {
            const label = plugin.generateUrl("foo");
            assert.equal(label, "plugin://plugin.video.piped/watch/foo");
        });
    });
});
