import assert from "assert";
import { extractVideo, extractPlaylist, extractEmbed, extractMinify }
                                 from "../../../../src/core/scraper/youtube.js";

describe("core/scraper/youtube.js", function () {
    describe("extractVideo()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://www.youtube.com/feed/trending";
            const content = undefined;
            const options = { incognito: false };

            const file = await extractVideo(new URL(url), content, options);
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a video", async function () {
            browser.storage.local.set({ "youtube-playlist": "playlist" });

            const url = "https://www.youtube.com/watch?x=123456";
            const content = undefined;
            const options = { incognito: false };

            const file = await extractVideo(new URL(url), content, options);
            assert.strictEqual(file, null);

            browser.storage.local.clear();
        });

        it("should return playlist id", async function () {
            browser.storage.local.set({ "youtube-playlist": "playlist" });

            const url = "https://www.youtube.com/watch" +
                                     "?v=avt4ZWlVjdY" +
                                     "&list=PL7nedIL_qbuZBS5ZAiGkjB1LW9C3zZvum";
            const content = undefined;
            const options = { incognito: false };

            const file = await extractVideo(new URL(url), content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/" +
                             "?playlist_id=PL7nedIL_qbuZBS5ZAiGkjB1LW9C3zZvum" +
                                                     "&play=1&incognito=false");

            browser.storage.local.clear();
        });

        it("should return video id", async function () {
            browser.storage.local.set({ "youtube-playlist": "video" });

            const url = "https://www.youtube.com/watch" +
                                     "?v=avt4ZWlVjdY" +
                                     "&list=PL7nedIL_qbuZBS5ZAiGkjB1LW9C3zZvum";
            const content = undefined;
            const options = { incognito: true };

            const file = await extractVideo(new URL(url), content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/?video_id=avt4ZWlVjdY" +
                                                             "&incognito=true");

            browser.storage.local.clear();
        });

        it("should return video id even with playlist option",
                                                             async function () {
            browser.storage.local.set({ "youtube-playlist": "playlist" });

            const url = "https://www.youtube.com/watch?v=sWfAtMQa_yo";
            const content = undefined;
            const options = { incognito: false };

            const file = await extractVideo(new URL(url), content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/?video_id=sWfAtMQa_yo" +
                                                            "&incognito=false");

            browser.storage.local.clear();
        });

        it("should return video id when protocol is HTTP", async function () {
            browser.storage.local.set({ "youtube-playlist": "playlist" });

            const url = "http://www.youtube.com/watch?v=sWfAtMQa_yo";
            const content = undefined;
            const options = { incognito: true };

            const file = await extractVideo(new URL(url), content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/?video_id=sWfAtMQa_yo" +
                                                             "&incognito=true");

            browser.storage.local.clear();
        });

        it("should return null when it's not a video from mobile",
                                                             async function () {
            browser.storage.local.set({ "youtube-playlist": "video" });

            const url = "https://m.youtube.com/watch?a=dQw4w9WgXcQ";
            const content = undefined;
            const options = { incognito: false };

            const file = await extractVideo(new URL(url), content, options);
            assert.strictEqual(file, null);

            browser.storage.local.clear();
        });

        it("should return video id from mobile", async function () {
            browser.storage.local.set({ "youtube-playlist": "playlist" });

            const url = "https://m.youtube.com/watch?v=dQw4w9WgXcQ";
            const content = undefined;
            const options = { incognito: false };

            const file = await extractVideo(new URL(url), content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/?video_id=dQw4w9WgXcQ" +
                                                            "&incognito=false");

            browser.storage.local.clear();
        });

        it("should return null when it's not a video from music",
                                                             async function () {
            browser.storage.local.set({ "youtube-playlist": "video" });

            const url = "https://music.youtube.com/watch?m=abcdef";
            const content = undefined;
            const options = { incognito: false };

            const file = await extractVideo(new URL(url), content, options);
            assert.strictEqual(file, null);

            browser.storage.local.clear();
        });

        it("should return video id from music", async function () {
            browser.storage.local.set({ "youtube-playlist": "video" });

            const url = "https://music.youtube.com/watch" +
                                                      "?v=IOqxarVWKRs" +
                                                      "&list=RDAMVMIOqxarVWKRs";
            const content = undefined;
            const options = { incognito: true };

            const file = await extractVideo(new URL(url), content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/?video_id=IOqxarVWKRs" +
                                                             "&incognito=true");

            browser.storage.local.clear();
        });

        it("should return video id from invidio.us", async function () {
            browser.storage.local.set({ "youtube-playlist": "video" });

            const url = "https://invidio.us/watch?v=e6EQwSadpPk";
            const content = undefined;
            const options = { incognito: false };

            const file = await extractVideo(new URL(url), content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/?video_id=e6EQwSadpPk" +
                                                            "&incognito=false");

            browser.storage.local.clear();
        });

        it("should return video id from hooktube", async function () {
            browser.storage.local.set({ "youtube-playlist": "video" });

            const url = "https://hooktube.com/watch?v=LACbVhgtx9I";
            const content = undefined;
            const options = { incognito: true };

            const file = await extractVideo(new URL(url), content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/?video_id=LACbVhgtx9I" +
                                                             "&incognito=true");

            browser.storage.local.clear();
        });
    });

    describe("extractPlaylist()", function () {
        it("should return null when it's not a playlist", async function () {
            const url = "https://www.youtube.com/playlist?v=dQw4w9WgXcQ";
            const content = undefined;
            const options = { incognito: false };

            const file = await extractPlaylist(new URL(url), content, options);
            assert.strictEqual(file, null);
        });

        it("should return playlist id", async function () {
            const url = "https://www.youtube.com/playlist" +
                                     "?list=PLd8UclkuwTj9vaRGP3859UHcdmlrkAd-9";
            const content = undefined;
            const options = { incognito: false };

            const file = await extractPlaylist(new URL(url), content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/" +
                             "?playlist_id=PLd8UclkuwTj9vaRGP3859UHcdmlrkAd-9" +
                                                     "&play=1&incognito=false");
        });

        it("should return null when it's not a playlist from mobile",
                                                             async function () {
            const url = "https://m.youtube.com/playlist" +
                                                   "?video=PL3A5849BDE0581B19" +
                                                   "&incognito=false";
            const content = undefined;
            const options = { incognito: false };

            const file = await extractPlaylist(new URL(url), content, options);
            assert.strictEqual(file, null);
        });

        it("should return playlist id from mobile", async function () {
            const url = "https://m.youtube.com/playlist" +
                                                     "?list=PL3A5849BDE0581B19";
            const content = undefined;
            const options = { incognito: true };

            const file = await extractPlaylist(new URL(url), content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/" +
                                             "?playlist_id=PL3A5849BDE0581B19" +
                                                      "&play=1&incognito=true");
        });
    });

    describe("extractEmbed()", function () {
        it("should return video id", async function () {
            const url = "https://www.youtube.com/embed/v3gefWEggSc";
            const content = undefined;
            const options = { incognito: false };

            const file = await extractEmbed(new URL(url), content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/?video_id=v3gefWEggSc" +
                                                            "&incognito=false");
        });

        it("should return video id without cookie", async function () {
            const url = "https://www.youtube-nocookie.com/embed/u9gVaeb9le4";
            const content = undefined;
            const options = { incognito: true };

            const file = await extractEmbed(new URL(url), content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/?video_id=u9gVaeb9le4" +
                                                             "&incognito=true");
        });

        it("should return video id form invidio.us", async function () {
            const url = "https://invidio.us/embed/8cmBd7lkunk";
            const content = undefined;
            const options = { incognito: false };

            const file = await extractEmbed(new URL(url), content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/?video_id=8cmBd7lkunk" +
                                                            "&incognito=false");
        });

        it("should return video id from hooktube", async function () {
            const url = "https://hooktube.com/embed/3lPSQ5KjamI";
            const content = undefined;
            const options = { incognito: true };

            const file = await extractEmbed(new URL(url), content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/?video_id=3lPSQ5KjamI" +
                                                             "&incognito=true");
        });
    });

    describe("extractMinify()", function () {
        it("should return video id", async function () {
            const url = "https://youtu.be/NSFbekvYOlI";
            const content = undefined;
            const options = { incognito: false };

            const file = await extractMinify(new URL(url), content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/?video_id=NSFbekvYOlI" +
                                                            "&incognito=false");
        });
    });
});
