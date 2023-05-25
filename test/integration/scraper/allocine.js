/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: AlloCiné", function () {
    it("should return undefined when it isn't a video", async function () {
        const url = new URL("https://www.allocine.fr/video/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    it("should return video URL", async function () {
        const url = new URL("https://www.allocine.fr/video/video-19577157/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "https://fr.vid.web.acsta.net/nmedia/33/18/02/23/15" +
                "/19577157_hd_013.mp4",
        );
    });

    it("should return video URL when protocol is HTTP", async function () {
        const url = new URL(
            "http://www.allocine.fr/video" +
                "/player_gen_cmedia=19131078&cfilm=147912.html",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "https://fr.vid.web.acsta.net/nmedia/s3/33/18/78/52/54" +
                "/19131078_sd_013.mp4",
        );
    });

    it("should return video URL from video URL without protocol", async function () {
        const url = new URL(
            "https://www.allocine.fr/article" +
                "/fichearticle_gen_carticle=18706016.html",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "https://fr.vid.web.acsta.net/nmedia/33/19/10/22/06" +
                "//19586244_hd_013.mp4",
        );
    });
});
