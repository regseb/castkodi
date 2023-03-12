/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import { complete } from "../../../src/core/labellers.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Labeller: YouTube", function () {
    it("should return video label", async function () {
        browser.storage.local.set({ "youtube-playlist": "video" });
        const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        const item = await complete({
            file,
            label: "play",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file,
            label:
                "Rick Astley - Never Gonna Give You Up (Official Music" +
                " Video)",
            position: 0,
            title: "",
            type: "unknown",
        });

        assert.equal(stub.callCount, 1);
        assert.deepEqual(stub.firstCall.args, ["video"]);
    });

    it("should return video title", async function () {
        // Tester le cas quand la lecture de la vidéo est terminé et que
        // l'extension a modifié le titre.
        const item = await complete({
            file:
                "plugin://plugin.video.youtube/play/" +
                "?video_id=WBNjyvbqRYY&incognito=false",
            label: "La Marseillaise s’empare de Paris",
            position: 0,
            title: "La Marseillaise s’empare de Paris",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file:
                "plugin://plugin.video.youtube/play/" +
                "?video_id=WBNjyvbqRYY&incognito=false",
            label: "La Marseillaise s’empare de Paris",
            position: 0,
            title: "La Marseillaise s’empare de Paris",
            type: "unknown",
        });
    });

    it("should return unavailable label", async function () {
        browser.storage.local.set({ "youtube-playlist": "video" });
        const stub = sinon
            .stub(kodi.addons, "getAddons")
            .resolves(["plugin.video.tubed"]);

        const url = new URL("https://www.youtube.com/watch?v=v_cwYv4K2vo");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        const item = await complete({
            file,
            label: "",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file,
            label: "(Video unavailable)",
            position: 0,
            title: "",
            type: "unknown",
        });

        assert.equal(stub.callCount, 1);
        assert.deepEqual(stub.firstCall.args, ["video"]);
    });

    it("should return unavailable label for private video", async function () {
        browser.storage.local.set({ "youtube-playlist": "video" });
        const stub = sinon
            .stub(kodi.addons, "getAddons")
            .resolves(["plugin.video.tubed"]);

        const url = new URL("https://www.youtube.com/watch?v=4fVLxS3BMpQ");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        const item = await complete({
            file,
            label: "",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file,
            label: "(Video unavailable)",
            position: 0,
            title: "",
            type: "unknown",
        });

        assert.equal(stub.callCount, 1);
        assert.deepEqual(stub.firstCall.args, ["video"]);
    });

    it("should return playlist label", async function () {
        browser.storage.local.set({ "youtube-playlist": "playlist" });
        const stub = sinon
            .stub(kodi.addons, "getAddons")
            .resolves(["plugin.video.youtube"]);

        const url = new URL(
            "https://www.youtube.com/playlist?list=PL6B3937A5D230E335",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        const item = await complete({
            file,
            label: "",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file,
            label: "Official Blender Open Movies",
            position: 0,
            title: "",
            type: "unknown",
        });

        assert.equal(stub.callCount, 1);
        assert.deepEqual(stub.firstCall.args, ["video"]);
    });

    it("should return mix label", async function () {
        browser.storage.local.set({ "youtube-playlist": "playlist" });
        const stub = sinon
            .stub(kodi.addons, "getAddons")
            .resolves(["plugin.video.tubed", "plugin.video.youtube"]);

        const url = new URL(
            "https://www.youtube.com/watch?v=Yrm_kb1d-Xc" +
                "&list=RDYrm_kb1d-Xc",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        const item = await complete({
            file,
            label: "",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file,
            label: "Mix",
            position: 0,
            title: "",
            type: "unknown",
        });

        assert.equal(stub.callCount, 1);
        assert.deepEqual(stub.firstCall.args, ["video"]);
    });

    it("should return mix label from YouTube Music", async function () {
        browser.storage.local.set({ "youtube-playlist": "playlist" });
        const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL(
            "https://music.youtube.com/watch?v=9bZkp7q19f0&list=RD9bZkp7q19f0",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        const item = await complete({
            file,
            label: "",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file,
            label: "Mix",
            position: 0,
            title: "",
            type: "unknown",
        });

        assert.equal(stub.callCount, 1);
        assert.deepEqual(stub.firstCall.args, ["video"]);
    });
});
