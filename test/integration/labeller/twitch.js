import assert                 from "assert";
import { extract as scraper } from "../../../src/core/scrapers.js";
import { extract }            from "../../../src/core/labellers.js";

describe("Labeller: Twitch", function () {
    it("should return channel label", async function () {
        // Récupérer l'URL d'une chaine en live en passant par la version mobile
        // car la version classique charge le contenu de la page en asynchrone
        // avec des APIs.
        const response = await fetch("https://m.twitch.tv/directory/all");
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");

        const url = "https://m.twitch.tv" +
                    doc.querySelector(".channel-list a.tw-link").href;
        const options = { depth: false, incognito: false };

        const file = await scraper(new URL(url), options);
        const label = await extract({ file, label: "", type: "unknown" });
        assert.notStrictEqual(label, null);
    });

    it("should return default label when channel is offline",
                                                             async function () {
        const url = "https://www.twitch.tv/supersynock";
        const options = { depth: false, incognito: false };

        const file = await scraper(new URL(url), options);
        const label = await extract({ file, label: "", type: "unknown" });
        assert.strictEqual(label, "supersynock");
    });

    it("should return video label", async function () {
        // Récupérer l'URL d'une vidéo en passant par la version mobile car la
        // version classique charge le contenu de la page en asynchrone avec des
        // APIs.
        const response = await fetch("https://m.twitch.tv/canardpc/profile");
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");

        const url = "https://m.twitch.tv" +
                    doc.querySelector(`a.tw-link[href^="/videos/"]`).href;
        const options = { depth: false, incognito: false };

        const file = await scraper(new URL(url), options);
        const label = await extract({ file, label: "", type: "unknown" });
        assert.notStrictEqual(label, null);
    });
});
