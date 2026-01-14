/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as plugin from "../../../../src/core/plugin/primevideo.js";
import "../../setup.js";

describe("core/plugin/primevideo.js", () => {
    describe("generateUrl()", () => {
        it("should return URL with video id and name", () => {
            const label = plugin.generateUrl("foo", "Bar");
            assert.equal(
                label,
                "plugin://plugin.video.amazon-test/" +
                    "?mode=PlayVideo&asin=foo&name=Bar",
            );
        });
    });
});
