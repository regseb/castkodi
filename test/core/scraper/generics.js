import assert    from "assert";
import { URL }   from "url";
import { rules } from "../../../src/core/scraper/generics.js";

describe("scraper/generics", function () {
    describe("*://*/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a page HTML", async function () {
            const url = "https://kodi.tv/sites/default/themes/kodi/" +
                                                                 "logo-sbs.svg";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return media URL", async function () {
            const url = "https://www.bitchute.com/video/dz5JcCZnJMge/";
            const expected = "https://seed126.bitchute.com/hU2elaB5u3kB" +
                                                            "/dz5JcCZnJMge.mp4";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        describe("pippa", function () {
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

            it("should return audio URL when protocol is HTTP",
                                                             async function () {
                const url = "http://shows.pippa.io/cdanslair/episodes" +
                            "/hongkong-la-colere-monte-pekin-menace-19-11-2019";
                const expected = "https://app.pippa.io/public/streams" +
                                          "/5bb36892b799143c5a063e7f/episodes" +
                                                "/5dd4250950a8cbb62f4b21ad.mp3";

                const file = await action(new URL(url));
                assert.strictEqual(file, expected);
            });
        });

        describe("jamendo", function () {
            it("should return null when it's not a sound", async function () {
                const url = "https://www.jamendo.com/track/404/not-found";
                const expected = null;

                const file = await action(new URL(url));
                assert.strictEqual(file, expected);
            });

            it("should return audio URL", async function () {
                const url = "https://www.jamendo.com/track/3431" +
                                                      "/avant-j-etais-trappeur";
                const expected = "https://mp3l.jamendo.com/" +
                                  "?trackid=3431&format=mp31&from=app-97dab294";

                const file = await action(new URL(url));
                assert.strictEqual(file, expected);
            });

            it("should return audio URL when protocol is HTTP",
                                                             async function () {
                const url = "http://www.jamendo.com/track/33454" +
                                                          "/vacance-au-camping";
                const expected = "https://mp3l.jamendo.com/" +
                                 "?trackid=33454&format=mp31&from=app-97dab294";

                const file = await action(new URL(url));
                assert.strictEqual(file, expected);
            });
        });

        describe("instagram", function () {
            it("should return null when it's not a video", async function () {
                const url = "https://www.instagram.com/p/6p_BDeK-8G/";
                const expected = null;

                const file = await action(new URL(url));
                assert.strictEqual(file, expected);
            });

            it("should return video URL", async function () {
                const url = "https://www.instagram.com/p/BpFwZ6JnYPq/";
                const expected = "/43507506_351933205369613" +
                                                  "_6559511411523846144_n.mp4?";

                const file = await action(new URL(url));
                assert.ok(file.includes(expected),
                          `"${file}".includes(expected)`);
            });

            it("should return video URL when protocol is HTTP",
                                                             async function () {
                const url = "https://www.instagram.com/p/Bpji87LiJFs/";
                const expected = "/44876841_340575853170202" +
                                                  "_7413375163648966656_n.mp4?";

                const file = await action(new URL(url));
                assert.ok(file.includes(expected),
                          `"${file}".includes(expected)`);
            });
        });

        describe("1tv", function () {
            it("should return null when it's not a show", async function () {
                const url = "https://www.1tv.ru/shows/kvn";
                const expected = null;

                const file = await action(new URL(url));
                assert.strictEqual(file, expected);
            });

            it("should return show URL", async function () {
                const url = "https://www.1tv.ru/shows/pozner/izbrannoe" +
                    "/razvlech-publiku-lozhyu-slozhno-maksim-galkin-o-svobode" +
                                "-yumora-pozner-fragment-vypuska-ot-03-06-2019";
                const expected = "https://balancer-vod.1tv.ru/video" +
                                              "/multibitrate/video/2019/06/03" +
                                       "/0535f134-80c9-40f2-af3b-6bb485488fe8" +
                                                "_20190604_Pozner_High_950.mp4";

                const file = await action(new URL(url));
                assert.strictEqual(file, expected);
            });

            it("should return show URL when protocol is HTTP",
                                                             async function () {
                const url = "http://www.1tv.ru/shows/zdorove/vypuski" +
                                                "/zdorove-vypusk-ot-26-05-2019";
                const expected = "https://balancer-vod.1tv.ru/video" +
                                              "/multibitrate/video/2019/05/26" +
                                       "/0bcc8f80-6082-4589-85b1-fcc000e150e9" +
                             "_HD-news-2019_05_26-08_19_35_2923421_cut_950.mp4";

                const file = await action(new URL(url));
                assert.strictEqual(file, expected);
            });

            it("should return null when it's not a movie", async function () {
                const url = "https://www.1tv.ru/movies/vse-filmy";
                const expected = null;

                const file = await action(new URL(url));
                assert.strictEqual(file, expected);
            });

            it("should return movie URL", async function () {
                const url = "https://www.1tv.ru/-/kzrqw";
                const expected = "https://balancer-vod.1tv.ru/video" +
                                              "/multibitrate/video/2019/11/18" +
                                       "/02855eb5-946e-4fed-a2e1-b03684328a36" +
                                         "_HD-news-2019_11_18-22_44_07_950.mp4";

                const file = await action(new URL(url));
                assert.strictEqual(file, expected);
            });
        });

        describe("streamable", function () {
            it("should return video URL", async function () {
                const url = "https://streamable.com/tapn9";
                const expected = "https://cdn-b-east.streamable.com/video/mp4" +
                                                                  "/tapn9.mp4?";

                const file = await action(new URL(url));
                assert.ok(file.startsWith(expected),
                          `"${file}".startsWith(expected)`);
            });
        });
    });
});
