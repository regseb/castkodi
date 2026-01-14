/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as plugin from "../../../../src/core/plugin/vrtnu.js";
import "../../setup.js";

describe("core/plugin/vrtnu.js", () => {
    describe("generateUrl()", () => {
        it("should return URL with video URL", () => {
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
