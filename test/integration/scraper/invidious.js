/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Invidious", function () {
    it("should return video id [youtube]", async function () {
        browser.storage.local.set({ "youtube-playlist": "video" });
        const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL("https://invidio.us/watch?v=e6EQwSadpPk");
        const options = { depth: false, incognito: true };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.youtube/play/" +
                "?video_id=e6EQwSadpPk&incognito=true",
        );

        assert.equal(stub.callCount, 1);
        assert.deepEqual(stub.firstCall.args, ["video"]);
    });

    it("should return embed video id [youtube]", async function () {
        const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL("https://invidio.us/embed/8cmBd7lkunk");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.youtube/play/" +
                "?video_id=8cmBd7lkunk&incognito=false",
        );

        assert.equal(stub.callCount, 1);
        assert.deepEqual(stub.firstCall.args, ["video"]);
    });
});
