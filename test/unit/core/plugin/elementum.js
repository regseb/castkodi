/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as plugin from "../../../../src/core/plugin/elementum.js";

describe("core/plugin/elementum.js", function () {
    describe("generateUrl()", function () {
        it("should return URL with torrent URL", function () {
            const label = plugin.generateUrl(
                new URL("https://foo.fr/bar.torrent"),
            );
            assert.equal(
                label,
                "plugin://plugin.video.elementum/play" +
                    "?uri=https%3A%2F%2Ffoo.fr%2Fbar.torrent",
            );
        });
    });
});
