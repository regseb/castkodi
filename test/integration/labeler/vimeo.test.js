/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { complete } from "../../../src/core/labelers.js";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

// Désactiver les tests, car Vimeo détecte que la requête provient d'un robot et
// il affiche une page de vérification.
//
// """
//  Verify to continue
//
//  To continue, please confirm that you're a human (and not a spambot).
//  Checking if the site connection is secure
//
//  vimeo.com needs to review the security of your connection before proceeding.
// """
describe.skip("Labeler: Vimeo", () => {
    it("should return video label", async () => {
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

    it("should return video label from unlisted video", async () => {
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

    it("should return video title", async () => {
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
