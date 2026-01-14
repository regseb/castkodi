/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as plugin from "../../../../src/core/plugin/elementum.js";
import "../../setup.js";

describe("core/plugin/elementum.js", () => {
    describe("generateUrl()", () => {
        it("should return URL with torrent URL", () => {
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
