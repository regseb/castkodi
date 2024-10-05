/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as plugin from "../../../../src/core/plugin/dailymotion.js";

describe("core/plugin/dailymotion.js", function () {
    describe("generateUrl()", function () {
        it("should return URL with video id", function () {
            const label = plugin.generateUrl("foo");
            assert.equal(
                label,
                "plugin://plugin.video.dailymotion_com/" +
                    "?mode=playVideo&url=foo",
            );
        });
    });
});
