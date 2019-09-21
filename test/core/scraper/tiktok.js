import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/tiktok.js";

describe("scraper/tiktok", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://www.tiktok.com/tag/storytime?langCountry=fr";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://www.tiktok.com/*/video/*", function () {
        let action;
        before(function () {
            action = rules.get(this.test.parent.title);
        });

        it("should return null when it's not a video", function () {
            const url = "https://www.tiktok.com/@notfound/video/404";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video URL", function () {
            const url = "https://www.tiktok.com/@the90guy/video" +
                                          "/6710341586984635654?langCountry=fr";
            const expected = "&rc=ampvbHJwdnV4bjMzOjczM0ApPDM7OGU" +
                             "0aWU3NzM8aTY1PGc0azNhbmpja2NfLS0zMT" +
                             "ZzczI1LzQyMF8yYV81X141LS06Yw%3D%3D";
            return action(new URL(url)).then(function (file) {
                assert.ok(file.endsWith(expected),
                          `"${file}".endsWith(expected)`);
            });
        });

        it("should return video URL when protocol is HTTP", function () {
            const url = "http://www.tiktok.com/@antonivilloni/video" +
                                                         "/6729403951285882118";
            const expected = "&rc=ajlxNng0aXd0bzMzNjczM0ApZzdpZTo" +
                             "8NWVnNzQ3NmY6ZmdmbzRhXi9iNmVfLS1eMT" +
                             "ZzczIyMzZeMzQvY2AuYDM1XzE6Yw%3D%3D";
            return action(new URL(url)).then(function (file) {
                assert.ok(file.endsWith(expected),
                          `"${file}".endsWith(expected)`);
            });
        });
    });
});
