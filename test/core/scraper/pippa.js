import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/pippa.js";

describe("scraper/pippa", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL",
                                                             async function () {
            const url = "https://shows.pippa.io/studio-404";

            const file = await extract(url);
            assert.strictEqual(file, url);
        });
    });

    describe("*://shows.pippa.io/*/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not an audio", async function () {
            const url = "https://shows.pippa.io/studio-404/";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return audio URL", async function () {
            const url = "https://shows.pippa.io/cdanslair/episodes" +
                                "/5-decembre-la-greve-qui-fait-peur-22-11-2019";
            const expected = "https://app.pippa.io/public/streams" +
                                          "/5bb36892b799143c5a063e7f/episodes" +
                                                "/5dd81469bd860fd53f965cf7.mp3";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return audio URL when protocol is HTTP", async function () {
            const url = "http://shows.pippa.io/cdanslair/episodes" +
                            "/hongkong-la-colere-monte-pekin-menace-19-11-2019";
            const expected = "https://app.pippa.io/public/streams" +
                                          "/5bb36892b799143c5a063e7f/episodes" +
                                                "/5dd4250950a8cbb62f4b21ad.mp3";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
