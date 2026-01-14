/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as plugin from "../../../../src/core/plugin/vimeo.js";
import "../../setup.js";

describe("core/plugin/vimeo.js", () => {
    describe("generateUrl()", () => {
        it("should return URL with video id", () => {
            const label = plugin.generateUrl("foo", undefined);
            assert.equal(
                label,
                "plugin://plugin.video.vimeo/play/?video_id=foo",
            );
        });

        it("should return URL with video id and hash", () => {
            const label = plugin.generateUrl("foo", "bar");
            assert.equal(
                label,
                "plugin://plugin.video.vimeo/play/?video_id=foo:bar",
            );
        });
    });
});
