/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
import * as scraper from "../../../../src/core/scraper/vimeo.js";

describe("core/scraper/vimeo.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://vimeo.com/channels");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return video id", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://player.vimeo.com/video/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.vimeo/play/?video_id=foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video id with hash", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://player.vimeo.com/video/foo?h=bar");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.vimeo/play/?video_id=foo:bar",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video id to vimeo", async function () {
            const stub = sinon
                .stub(kodi.addons, "getAddons")
                .resolves(["plugin.video.sendtokodi", "plugin.video.vimeo"]);

            const url = new URL("https://player.vimeo.com/video/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.vimeo/play/?video_id=foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video id with hash to vimeo", async function () {
            const stub = sinon
                .stub(kodi.addons, "getAddons")
                .resolves(["plugin.video.sendtokodi", "plugin.video.vimeo"]);

            const url = new URL("https://player.vimeo.com/video/foo?h=bar");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.vimeo/play/?video_id=foo:bar",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video id to sendtokodi", async function () {
            const stub = sinon
                .stub(kodi.addons, "getAddons")
                .resolves(["plugin.video.sendtokodi"]);

            const url = new URL("https://player.vimeo.com/video/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/?https://vimeo.com/foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video id with hash to sendtokodi", async function () {
            const stub = sinon
                .stub(kodi.addons, "getAddons")
                .resolves(["plugin.video.sendtokodi"]);

            const url = new URL("https://player.vimeo.com/video/foo?h=bar");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/?https://vimeo.com/foo/bar",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });
    });
});
