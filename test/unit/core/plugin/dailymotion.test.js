/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as plugin from "../../../../src/core/plugin/dailymotion.js";
import "../../setup.js";

describe("core/plugin/dailymotion.js", () => {
    describe("generateUrl()", () => {
        it("should return URL with video id", () => {
            const label = plugin.generateUrl("foo");
            assert.equal(
                label,
                "plugin://plugin.video.dailymotion_com/" +
                    "?mode=playVideo&url=foo",
            );
        });
    });
});
