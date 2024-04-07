/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as plugin from "../../../../src/core/plugin/primevideo.js";

describe("core/plugin/primevideo.js", function () {
    describe("generateUrl()", function () {
        it("should return URL with video id and name", function () {
            const label = plugin.generateUrl("foo", "Bar");
            assert.equal(
                label,
                "plugin://plugin.video.amazon-test/" +
                    "?mode=PlayVideo&asin=foo&name=Bar",
            );
        });
    });
});
