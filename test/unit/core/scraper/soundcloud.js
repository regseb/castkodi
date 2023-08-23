/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
import * as scraper from "../../../../src/core/scraper/soundcloud.js";

describe("core/scraper/soundcloud.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://developers.soundcloud.com/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return audio URL", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://soundcloud.com/foo/bar");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.audio.soundcloud/play/" +
                    "?url=https%3A%2F%2Fsoundcloud.com%2Ffoo%2Fbar",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["audio", "video"]);
        });

        it("should return audio URL from mobile version", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://mobi.soundcloud.com/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.audio.soundcloud/play/" +
                    "?url=https%3A%2F%2Fsoundcloud.com%2Ffoo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["audio", "video"]);
        });

        it("should return audio URL to soundcloud", async function () {
            const stub = sinon
                .stub(kodi.addons, "getAddons")
                .resolves([
                    "plugin.audio.soundcloud",
                    "plugin.video.sendtokodi",
                ]);

            const url = new URL("https://soundcloud.com/foo/bar");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.audio.soundcloud/play/" +
                    "?url=https%3A%2F%2Fsoundcloud.com%2Ffoo%2Fbar",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["audio", "video"]);
        });

        it("should return audio URL to sendtokodi", async function () {
            const stub = sinon
                .stub(kodi.addons, "getAddons")
                .resolves(["plugin.video.sendtokodi"]);

            const url = new URL("https://soundcloud.com/foo/bar");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/" +
                    "?https://soundcloud.com/foo/bar",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["audio", "video"]);
        });
    });
});
