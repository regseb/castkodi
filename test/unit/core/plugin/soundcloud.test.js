/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as plugin from "../../../../src/core/plugin/soundcloud.js";
import "../../setup.js";

describe("core/plugin/soundcloud.js", () => {
    describe("generateUrl()", () => {
        it("should return URL with video URL", () => {
            const label = plugin.generateUrl(
                new URL("https://foo.com/bar.html"),
            );
            assert.equal(
                label,
                "plugin://plugin.audio.soundcloud/play/" +
                    "?url=https%3A%2F%2Ffoo.com%2Fbar.html",
            );
        });
    });
});
