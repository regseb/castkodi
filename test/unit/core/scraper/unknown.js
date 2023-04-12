/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
import * as scraper from "../../../../src/core/scraper/unknown.js";

describe("core/scraper/unknown.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's depth", async function () {
            const url = new URL("https://foo.com/");
            const content = undefined;
            const options = { depth: true, incognito: false };

            const file = await scraper.extract(url, content, options);
            assert.equal(file, undefined);
        });

        it("should use SendToKodi plugin", async function () {
            const stub = sinon
                .stub(kodi.addons, "getAddons")
                .resolves(["plugin.video.sendtokodi"]);

            const url = new URL("https://foo.com/");
            const content = undefined;
            const options = { depth: false, incognito: false };

            const file = await scraper.extract(url, content, options);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/?https://foo.com/",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return undefined when there isn't plugin", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://foo.com/");
            const content = undefined;
            const options = { depth: false, incognito: false };

            const file = await scraper.extract(url, content, options);
            assert.equal(file, undefined);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });
    });
});
