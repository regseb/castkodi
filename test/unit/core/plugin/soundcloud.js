/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as plugin from "../../../../src/core/plugin/soundcloud.js";

describe("core/plugin/soundcloud.js", function () {
    describe("generateUrl()", function () {
        it("should return URL with video URL", function () {
            const label = plugin.generateUrl(
                new URL("http://foo.com/bar.html"),
            );
            assert.equal(
                label,
                "plugin://plugin.audio.soundcloud/play/" +
                    "?url=http%3A%2F%2Ffoo.com%2Fbar.html",
            );
        });
    });
});
