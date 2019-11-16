import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/allocine.js";

describe("scraper/allocine", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL",
                                                             async function () {
            const url = "https://secure.allocine.fr/account";

            const file = await extract(url);
            assert.strictEqual(file, url);
        });
    });

    describe("http://www.allocine.fr/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a video", async function () {
            const url = "http://www.allocine.fr/video/";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return standard video URL", async function () {
            const url = "http://www.allocine.fr/video/video-19577157/";
            const expected = "https://fr.vid.web.acsta.net/nmedia/33/18/02/23" +
                                                      "/15/19577157_sd_013.mp4";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return high video URL", async function () {
            const url = "http://www.allocine.fr/video" +
                                "/player_gen_cmedia=19583315&cfilm=232669.html";
            const expected = "http://fr.vid.web.acsta.net/nmedia/33/19/04/02" +
                                                     "/14//19583315_hd_013.mp4";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return medium video URL", async function () {
            const url = "http://www.allocine.fr/video" +
                                  "/player_gen_cmedia=19432206&cfilm=1051.html";
            const expected = "http://fr.vid.web.acsta.net/nmedia/s3/33/18/66" +
                                                   "/14/37/19432206_sd_013.mp4";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
