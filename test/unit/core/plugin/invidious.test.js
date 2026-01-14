/**
 * @license MIT
 * @author David Magnus Henriques
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as plugin from "../../../../src/core/plugin/invidious.js";
import "../../setup.js";

describe("core/plugin/invidious.js", () => {
    describe("generateUrl()", () => {
        it("should return Invidious URL", () => {
            const label = plugin.generateUrl("foo");
            assert.equal(
                label,
                "plugin://plugin.video.invidious/?action=play&videoId=foo",
            );
        });
    });
});
