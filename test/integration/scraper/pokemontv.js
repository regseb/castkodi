/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Pokémon TV", function () {
    it("should return URL when video is unavailable", async function () {
        const url = new URL(
            "https://watch.pokemon.com/fr-fr/#/season" +
                "?id=la-serie-pokemon-les-voyages",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, url.href);
    });

    it("should return french video URL", async function () {
        const url = new URL(
            "https://watch.pokemon.com/fr-fr/#/player" +
                "?id=31ed3ab48e734662bdeffe02ba591f34",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "https://s2.content.video.llnw.net/smedia" +
                "/4953336d7f544f678a12270b176ea386/Lp" +
                "/oOj5FgrXMO5KVDQNYScXLLLcSxAeZuive13gOTsqw" +
                "/pokemon_season22_ep01_fre.mp4",
        );
    });

    it("should return america video URL", async function () {
        const url = new URL(
            "https://watch.pokemon.com/en-us/#/player" +
                "?id=7fe404392a77410e88af4a19ca20184f",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "https://s2.content.video.llnw.net/smedia" +
                "/4953336d7f544f678a12270b176ea386/9d" +
                "/PJNLXod-FofH7EQth_xQW5otkXT6dCxyvcjvJPSrA" +
                "/pok_tv_s0101_2398-master-en.mp4",
        );
    });

    it("should return latin video URL", async function () {
        const url = new URL(
            "https://watch.pokemon.com/es-xl/#/player" +
                "?id=94223aa2b4d143799542c06fb66b5e64",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "https://s2.content.video.llnw.net/smedia" +
                "/4953336d7f544f678a12270b176ea386/gz" +
                "/3GZ5vZQYR6AIGfWdxHjDKaWW_2ojqCytoZ20o6OhQ" +
                "/pok_tv_s0101_2398-master-las.mp4",
        );
    });
});
