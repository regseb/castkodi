import assert from "node:assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: LBRY", function () {
    it("should return URL when it's not a video", async function () {
        const url = new URL("https://lbry.tv/$/2257");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return video URL", async function () {
        const url = new URL("https://lbry.tv/@lbry:3f/lbry-foundation:0");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://cdn.lbryplayer.xyz/api/v3/streams/free/lbry-foundation" +
                            "/0a4ef1c64f1c44b4e740dcf3f439afb8389a79e1/97d008");
    });

    it("should return embed video URL", async function () {
        const url = new URL("https://lbry.tv/$/embed" +
                                   "/which-operating-system-should-you-choose" +
                                  "/75defbc6fa104a78bb83e9d6ce378b1009313575?");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://cdn.lbryplayer.xyz/api/v3/streams/free" +
                                   "/which-operating-system-should-you-choose" +
                            "/75defbc6fa104a78bb83e9d6ce378b1009313575/824a95");
    });

    it("should return open video URL", async function () {
        const url = new URL("https://open.lbry.com/KODI:d");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://cdn.lbryplayer.xyz/api/v3/streams/free/KODI" +
                            "/dbdd6c2222d80bae1a47275210231ad3a9222a64/64210c");
    });
});
