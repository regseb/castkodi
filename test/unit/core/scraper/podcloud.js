import assert      from "assert";
import { extract } from "../../../../src/core/scraper/podcloud.js";

describe("core/scraper/podcloud.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://podcloud.fr/podcast/le-cosy-corner";

            const file = await extract(new URL(url));
            assert.strictEqual(file, null);
        });

        it("should return audio URL", async function () {
            const url = "https://podcloud.fr/podcast/le-cosy-corner/episode" +
                                          "/numero-51-sa-puissance-est-maximum";

            const file = await extract(new URL(url));
            assert.strictEqual(file,
                "https://podcloud.fr/ext/le-cosy-corner" +
                           "/numero-51-sa-puissance-est-maximum/enclosure.mp3");
        });

        it("should return audio URL when protocol is HTTP", async function () {
            const url = "https://podcloud.fr/podcast/2-heures-de-perdues" +
                                                            "/episode/stargate";

            const file = await extract(new URL(url));
            assert.strictEqual(file,
                "https://podcloud.fr/ext/2-heures-de-perdues" +
                                                     "/stargate/enclosure.mp3");
        });
    });
});
