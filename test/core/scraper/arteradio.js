import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("scraper/arteradio", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://www.arteradio.com/content/au_hasard";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://www.arteradio.com/son/*", function () {
        it("should return sound URL", function () {
            const url = "https://www.arteradio.com/son/61657661/fais_moi_ouir";
            const expected = "https://download.www.arte.tv/permanent/" +
                             "arteradio/sites/default/files/sons/" +
                             "01faismoiouir_hq_fr.mp3";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return sound URL when protocol is HTTP", function () {
            const url = "http://www.arteradio.com/son/61657661/fais_moi_ouir";
            const expected = "https://download.www.arte.tv/permanent/" +
                             "arteradio/sites/default/files/sons/" +
                             "01faismoiouir_hq_fr.mp3";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
