import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/arteradio.js";

describe("scraper/arteradio", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL",
                                                             async function () {
            const url = "https://www.arteradio.com/content/au_hasard";

            const file = await extract(url);
            assert.strictEqual(file, url);
        });
    });

    describe("*://www.arteradio.com/son/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return audio URL", async function () {
            const url = "https://www.arteradio.com/son/61657661/fais_moi_ouir";
            const expected = "https://download.www.arte.tv/permanent" +
                                         "/arteradio/sites/default/files/sons" +
                                                     "/01faismoiouir_hq_fr.mp3";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return audio URL when protocol is HTTP", async function () {
            const url = "http://www.arteradio.com/son/61657661/fais_moi_ouir";
            const expected = "https://download.www.arte.tv/permanent" +
                                         "/arteradio/sites/default/files/sons" +
                                                     "/01faismoiouir_hq_fr.mp3";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
