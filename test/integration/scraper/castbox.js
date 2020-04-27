import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Castbox", function () {
    it("should return URL when it's not an audio", async function () {
        const url = "https://castbox.fm/channel/Par-Jupiter-!-id1018326";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, url);
    });

    it("should return audio URL", async function () {
        const url = "https://castbox.fm/episode" +
                                        "/'Ultramoderne'-id1018326-id255945951";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file,
            "http://rf.proxycast.org/a9d93d50-7ee1-4ff2-9508-f318275d691f" +
                           "/18153-27.04.2020-ITEMA_22330612-4-1779455909.mp3");
    });
});
