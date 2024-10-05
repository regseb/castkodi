/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { complete } from "../../../src/core/labelers.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Labeler: Vimeo", function () {
    it("should return video label", async function () {
        const url = new URL("https://vimeo.com/265045525");
        const context = { depth: false, incognito: false };

        const file = /** @type {string} */ (await extract(url, context));
        const item = await complete({
            file,
            label: "play",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file,
            label: "Looking For Something",
            position: 0,
            title: "",
            type: "unknown",
        });
    });

    it("should return video label from unlisted video", async function () {
        const url = new URL("https://vimeo.com/304887422/34c51f7a09");
        const context = { depth: false, incognito: false };

        const file = /** @type {string} */ (await extract(url, context));
        const item = await complete({
            file,
            label: "play",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file,
            label: "Shaking",
            position: 0,
            title: "",
            type: "unknown",
        });
    });

    it("should return video title", async function () {
        // Tester le cas quand la lecture de la vidéo a commencé et que
        // l'extension a modifié le fichier et le titre.
        const item = await complete({
            file:
                "plugin://plugin.video.vimeo/play/" +
                "?uri=%2Fvideos%2F43241044&texttracks=",
            label: "M83 | Fleur & Manu I DIVISION",
            position: 1,
            title: "M83 | Fleur & Manu I DIVISION",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file:
                "plugin://plugin.video.vimeo/play/" +
                "?uri=%2Fvideos%2F43241044&texttracks=",
            label: "M83 | Fleur & Manu I DIVISION",
            position: 1,
            title: "M83 | Fleur & Manu I DIVISION",
            type: "unknown",
        });
    });
});
