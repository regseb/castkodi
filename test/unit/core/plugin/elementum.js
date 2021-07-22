import assert from "node:assert";
import * as plugin from "../../../../src/core/plugin/elementum.js";

describe("core/plugin/elementum.js", function () {
    describe("generateUrl()", function () {
        it("should return URL with torrent URL", async function () {
            const label = await plugin.generateUrl(new URL("http://foo.fr" +
                                                               "/bar.torrent"));
            assert.strictEqual(label,
                "plugin://plugin.video.elementum/play" +
                                      "?uri=http%3A%2F%2Ffoo.fr%2Fbar.torrent");
        });
    });
});
