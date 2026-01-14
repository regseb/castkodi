/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as plugin from "../../../../src/core/plugin/plexus.js";
import "../../setup.js";

describe("core/plugin/plexus.js", () => {
    describe("generateUrl()", () => {
        it("should return URL with video URL", () => {
            const label = plugin.generateUrl(new URL("acestream://foo"));
            assert.equal(
                label,
                "plugin://program.plexus/" +
                    "?mode=1&name=&url=acestream%3A%2F%2Ffoo",
            );
        });
    });
});
