import assert      from "assert";
import { extract } from "../../../../src/core/scraper/torrent.js";

describe("core/scraper/torrent.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://fr.wikipedia.org/wiki/BitTorrent";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video URL from torrent", async function () {
            const url = "https://archive.org/download/Sintel" +
                                                      "/Sintel_archive.torrent";
            const expected = "plugin://plugin.video.elementum/play" +
                                              "?uri=https%3A%2F%2Farchive.org" +
                                "%2Fdownload%2FSintel%2FSintel_archive.torrent";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video URL from magnet", async function () {
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

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
