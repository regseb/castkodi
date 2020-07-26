import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Ouest-France", function () {
    it("should return URL when it's not a video", async function () {
        const url = new URL("https://www.ouest-france.fr/festivals" +
                    "/festival-dangouleme/bd-grand-prix-d-angouleme-catherine" +
                 "-meurisse-chris-ware-et-emmanuel-guibert-finalistes-6690989");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return video URL", async function () {
        const url = new URL("https://www.ouest-france.fr/culture/cinema" +
                      "/festival-cannes/festival-de-cannes-spike-lee-cineaste" +
                          "-phare-de-la-cause-noire-president-du-jury-6688060");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(file.endsWith("/cd/be/cdbeda603ae5805ab0561403d5e1afabcd685" +
                                                       "162.mp4?mdtk=01124706"),
                  `"${file}".endsWith(...)`);
    });
});
