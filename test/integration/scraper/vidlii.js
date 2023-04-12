/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: VidLii", function () {
    it("should return undefined when it isn't a video", async function () {
        sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL("https://www.vidlii.com/help");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    it("should return video URL [video]", async function () {
        const url = new URL("https://www.vidlii.com/watch?v=2Ng8Abj2Fkl");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "https://www.vidlii.com/usfi/v/2Ng8Abj2Fkl.QfHzede4RBuRpC3G8glW4C" +
                "EDhFqKump_9NV0-enDJuqAGNLpWGSUVxr6RknIf63c4dOWAKdbBx-MBP__" +
                ".mp4",
        );
    });
});
