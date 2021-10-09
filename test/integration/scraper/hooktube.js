import assert from "node:assert";
import sinon from "sinon";
import { kodi } from "../../../src/core/kodi.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: HookTube", function () {
    it("should return video id [youtube]", async function () {
        browser.storage.local.set({ "youtube-playlist": "video" });
        const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL("https://hooktube.com/watch?v=LACbVhgtx9I");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.youtube/play/" +
                                       "?video_id=LACbVhgtx9I&incognito=false");

        assert.strictEqual(stub.callCount, 1);
        assert.deepStrictEqual(stub.firstCall.args, ["video"]);
    });

    it("should return embed video id [youtube]", async function () {
        const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL("https://hooktube.com/embed/3lPSQ5KjamI");
        const options = { depth: false, incognito: true };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.youtube/play/" +
                                        "?video_id=3lPSQ5KjamI&incognito=true");

        assert.strictEqual(stub.callCount, 1);
        assert.deepStrictEqual(stub.firstCall.args, ["video"]);
    });
});
