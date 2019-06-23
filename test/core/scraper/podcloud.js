import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/scrapers.js";
import { rules }   from "../../../src/core/scraper/podcloud.js";

describe("scraper/podcloud", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://podcloud.fr/podcast/le-cosy-corner";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://podcloud.fr/podcast/*/episode/*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return sound id", function () {
            const url = "https://podcloud.fr/podcast/le-cosy-corner/episode" +
                                          "/numero-51-sa-puissance-est-maximum";
            const expected = "https://podcloud.fr/ext/le-cosy-corner" +
                            "/numero-51-sa-puissance-est-maximum/enclosure.mp3";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return sound id when protocol is HTTP", function () {
            const url = "https://podcloud.fr/podcast/2-heures-de-perdues" +
                                                            "/episode/stargate";
            const expected = "https://podcloud.fr/ext/2-heures-de-perdues" +
                                                      "/stargate/enclosure.mp3";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
