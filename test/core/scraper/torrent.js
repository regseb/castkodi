import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("scraper/torrent", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://fr.wikipedia.org/wiki/BitTorrent";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*/*.torrent", function () {
        it("should return video URL", function () {
            const url = "http://vodo.net/media/torrents/" +
                                          "Sintel.2010.Theora.Ogv-VODO.torrent";
            const expected = "plugin://plugin.video.elementum/play?uri=" +
                                 "http%3A%2F%2Fvodo.net%2Fmedia%2Ftorrents%2F" +
                                          "Sintel.2010.Theora.Ogv-VODO.torrent";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("magnet:*", function () {
        it("should return video URL", function () {
            const url = "magnet:" +
                       "?xt=urn:btih:88594AAACBDE40EF3E2510C47374EC0AA396C08E" +
                                    "&dn=bbb_sunflower_1080p_30fps_normal.mp4" +
                  "&tr=udp%3a%2f%2ftracker.openbittorrent.com%3a80%2fannounce" +
                        "&tr=udp%3a%2f%2ftracker.publicbt.com%3a80%2fannounce" +
                       "&ws=http%3a%2f%2fdistribution.bbb3d.renderfarming.net" +
                        "%2fvideo%2fmp4%2fbbb_sunflower_1080p_30fps_normal.mp4";
            const expected = "plugin://plugin.video.elementum/play?uri=" +
                "magnet%3A" +
               "%3Fxt%3Durn%3Abtih%3A88594AAACBDE40EF3E2510C47374EC0AA396C08E" +
                                "%26dn%3Dbbb_sunflower_1080p_30fps_normal.mp4" +
    "%26tr%3Dudp%253a%252f%252ftracker.openbittorrent.com%253a80%252fannounce" +
          "%26tr%3Dudp%253a%252f%252ftracker.publicbt.com%253a80%252fannounce" +
             "%26ws%3Dhttp%253a%252f%252fdistribution.bbb3d.renderfarming.net" +
                  "%252fvideo%252fmp4%252fbbb_sunflower_1080p_30fps_normal.mp4";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
