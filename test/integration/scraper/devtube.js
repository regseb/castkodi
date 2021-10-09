import assert from "node:assert";
import sinon from "sinon";
import { kodi } from "../../../src/core/kodi.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: DevTube", function () {
    it("should return video id", async function () {
        const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL("https://dev.tube/video/4rWypxBwrR4");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.youtube/play/" +
                                       "?video_id=4rWypxBwrR4&incognito=false");

        assert.strictEqual(stub.callCount, 1);
        assert.deepStrictEqual(stub.firstCall.args, ["video"]);
    });
});
