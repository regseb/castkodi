import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Первый канал (1tv.ru)", function () {
    it("should return URL when it's not a show", async function () {
        const url = new URL("https://www.1tv.ru/shows/kvn");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return show URL", async function () {
        const url = new URL("https://www.1tv.ru/shows/pozner/izbrannoe" +
                    "/razvlech-publiku-lozhyu-slozhno-maksim-galkin-o-svobode" +
                               "-yumora-pozner-fragment-vypuska-ot-03-06-2019");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://balancer-vod.1tv.ru/video/multibitrate/video/2019/06/03" +
                                       "/0535f134-80c9-40f2-af3b-6bb485488fe8" +
                                              "_20190604_Pozner_High_3800.mp4");
    });

    it("should return show URL when protocol is HTTP", async function () {
        const url = new URL("http://www.1tv.ru/shows/zdorove/vypuski" +
                                               "/zdorove-vypusk-ot-26-05-2019");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://balancer-vod.1tv.ru/video/multibitrate/video/2019/05/26" +
                                       "/0bcc8f80-6082-4589-85b1-fcc000e150e9" +
                           "_HD-news-2019_05_26-08_19_35_2923421_cut_3800.mp4");
    });

    it("should return show URL from embed", async function () {
        const url = new URL("https://www.1tv.ru/embed/160522:12");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(file?.startsWith("https://balancer-vod.1tv.ru/video" +
                                                        "/multibitrate/video/"),
                  `"${file}"?.startsWith(...) from ${url}`);
        assert.ok(file?.includes("_Golos-"),
                  `"${file}"?.includes(...) from ${url}`);
        assert.ok(file?.endsWith(".mp4"),
                  `"${file}"?.endsWith(...) from ${url}`);
    });

    it("should return URL when it's not a movie", async function () {
        const url = new URL("https://www.1tv.ru/movies/vse-filmy");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return movie URL", async function () {
        // Récupérer l'URL d'une vidéo sur la page d'accueil des fichiers.
        const response = await fetch("https://www.1tv.ru/movies");
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");

        const url = new URL("https://www.1tv.ru" +
               doc.querySelector(`article.hasVideo[data-type="content_modal"]` +
                                 ` a[href^="/movies/"]`));
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(file?.startsWith("https://balancer-vod.1tv.ru/video" +
                                                        "/multibitrate/video/"),
                  `"${file}"?.startsWith(...) from ${url}`);
        assert.ok(file?.endsWith(".mp4"),
                  `"${file}"?.endsWith(...) from ${url}`);
    });
});
