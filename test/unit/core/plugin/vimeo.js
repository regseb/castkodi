/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as plugin from "../../../../src/core/plugin/vimeo.js";

describe("core/plugin/vimeo.js", function () {
    describe("generateUrl()", function () {
        it("should return URL with video id", function () {
            const label = plugin.generateUrl("foo", undefined);
            assert.equal(
                label,
                "plugin://plugin.video.vimeo/play/?video_id=foo",
            );
        });

        it("should return URL with video id and hash", function () {
            const label = plugin.generateUrl("foo", "bar");
            assert.equal(
                label,
                "plugin://plugin.video.vimeo/play/?video_id=foo:bar",
            );
        });
    });
});
