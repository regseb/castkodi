import assert from "node:assert";
import { config } from "../config.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Ouest-France", function () {
    before(function () {
        // Désactiver les tests de Ouest-France en dehors de la France car le
        // site utilise Ultimedia qui fonctionne seulement en France.
        if (undefined !== config.country && "fr" !== config.country) {
            // eslint-disable-next-line no-invalid-this
            this.skip();
        }
    });

    it("should return URL when it's not a video", async function () {
        const url = new URL("https://www.ouest-france.fr/festivals" +
                    "/festival-dangouleme/bd-grand-prix-d-angouleme-catherine" +
                 "-meurisse-chris-ware-et-emmanuel-guibert-finalistes-6690989");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return video URL [ouestfrance-ultimedia]", async function () {
        const url = new URL("https://www.ouest-france.fr/culture/cinema" +
                      "/festival-cannes/festival-de-cannes-spike-lee-cineaste" +
                          "-phare-de-la-cause-noire-president-du-jury-6688060");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(file?.endsWith("/cd/be/cdbeda603ae5805ab0561403d5e1afabcd68" +
                                                                    "5162.mp4"),
                  `"${file}"?.endsWith(...)`);
    });

    it("should return video URL when two iframe in page" +
                                 " [ouestfrance-ultimedia]", async function () {
        const url = new URL("https://www.ouest-france.fr/sante/virus" +
            "/coronavirus/coronavirus-en-france-le-nombre-de-cas-detectes" +
            "-augmente-plus-que-le-nombre-de-tests-effectues-6930380");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(file?.endsWith("/d7/5d/d75df81c7abb517d514bff22ab74816fa86a" +
                                                                    "3850.mp4"),
                  `"${file}"?.endsWith(...)`);
    });
});
