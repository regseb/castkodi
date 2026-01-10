/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as plugin from "../../../../src/core/plugin/vrtnu.js";

describe("core/plugin/vrtnu.js", function () {
    describe("generateUrl()", function () {
        it("should return URL with video URL", function () {
            const label = plugin.generateUrl(
                new URL("https://foo.com/bar.html"),
            );
            assert.equal(
                label,
                "plugin://plugin.video.vrt.nu/play/url/" +
                    "https://foo.com/bar.html",
            );
        });
    });
});
