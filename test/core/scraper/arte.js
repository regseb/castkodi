import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/arte.js";

describe("scraper/arte", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://www.arte.tv/fr/guide/";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://www.arte.tv/*/videos/*/*", function () {
        let action;
        before(function () {
            action = rules.get(this.test.parent.title);
        });

        it("should return french video URL", function () {
            const url = "https://www.arte.tv/fr/videos/067125-020-A" +
                                                              "/bits-top-list/";
            const expected = "https://arteptweb-a.akamaihd.net/am/ptweb" +
                                        "/067000/067100/067125-020-A_SQ_2_VOF" +
                                             "_02626371_MP4-2200_AMM-PTWEB.mp4";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return german video URL", function () {
            const url = "https://www.arte.tv/de/videos/077140-006-A" +
                                                     "/blow-up-john-carpenter" +
                                           "-aus-der-sicht-von-thierry-jousse/";
            const expected = "https://arteptweb-a.akamaihd.net/am/ptweb" +
                                     "/077000/077100/077140-006-A_SQ_0_VA-STA" +
                                   "_03470223_MP4-2200_AMM-PTWEB_u4hdDbkpd.mp4";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
