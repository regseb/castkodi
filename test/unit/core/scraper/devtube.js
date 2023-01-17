import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
import * as scraper from "../../../../src/core/scraper/devtube.js";

describe("core/scraper/devtube.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("https://dev.tube/@codingandrey");
            const content = undefined;
            const options = { incognito: false };

            const file = await scraper.extract(url, content, options);
            assert.equal(file, undefined);
        });

        it("should return video id with YouTube", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://dev.tube/video/foo");
            const content = undefined;
            const options = { incognito: true };

            const file = await scraper.extract(url, content, options);
            assert.equal(file,
                "plugin://plugin.video.youtube/play/?video_id=foo" +
                                                   "&incognito=true");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video id with Tubed", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([
                "plugin.video.tubed",
            ]);

            const url = new URL("https://dev.tube/video/foo");
            const content = undefined;
            const options = { incognito: false };

            const file = await scraper.extract(url, content, options);
            assert.equal(file,
                "plugin://plugin.video.tubed/?mode=play&video_id=foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });
    });
});
