import assert from "assert";
import { extractEmbed, extractMinify, extractPlaylist, extractVideo }
                                 from "../../../../src/core/scraper/youtube.js";

describe("core/scraper/youtube.js", function () {
    describe("extractVideo()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://www.youtube.com/feed/trending");
            const content = undefined;
            const options = { incognito: false };

            const file = await extractVideo(url, content, options);
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a video", async function () {
            browser.storage.local.set({ "youtube-playlist": "playlist" });

            const url = new URL("https://www.youtube.com/watch?x=foo");
            const content = undefined;
            const options = { incognito: false };

            const file = await extractVideo(url, content, options);
            assert.strictEqual(file, null);

            browser.storage.local.clear();
        });

        it("should return playlist id", async function () {
            browser.storage.local.set({
                "youtube-playlist": "playlist",
                "youtube-order":    "",
            });

            const url = new URL("https://www.youtube.com/watch?v=foo&list=bar");
            const content = undefined;
            const options = { incognito: false };

            const file = await extractVideo(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/" +
                              "?playlist_id=bar&order=&play=1&incognito=false");

            browser.storage.local.clear();
        });

        it("should return playlist id with default order", async function () {
            browser.storage.local.set({
                "youtube-playlist": "playlist",
                "youtube-order":    "default",
            });

            const url = new URL("https://www.youtube.com/watch?v=foo&list=bar");
            const content = undefined;
            const options = { incognito: false };

            const file = await extractVideo(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/" +
                       "?playlist_id=bar&order=default&play=1&incognito=false");

            browser.storage.local.clear();
        });

        it("should return video id", async function () {
            browser.storage.local.set({ "youtube-playlist": "video" });

            const url = new URL("https://www.youtube.com/watch?v=foo&list=bar");
            const content = undefined;
            const options = { incognito: true };

            const file = await extractVideo(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/" +
                                                "?video_id=foo&incognito=true");

            browser.storage.local.clear();
        });

        it("should return video id even with playlist option",
                                                             async function () {
            browser.storage.local.set({ "youtube-playlist": "playlist" });

            const url = new URL("https://www.youtube.com/watch?v=foo");
            const content = undefined;
            const options = { incognito: false };

            const file = await extractVideo(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/" +
                                               "?video_id=foo&incognito=false");

            browser.storage.local.clear();
        });

        it("should return video id when protocol is HTTP", async function () {
            browser.storage.local.set({ "youtube-playlist": "playlist" });

            const url = new URL("http://www.youtube.com/watch?v=foo");
            const content = undefined;
            const options = { incognito: true };

            const file = await extractVideo(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/" +
                                                "?video_id=foo&incognito=true");

            browser.storage.local.clear();
        });

        it("should return null when it's not a video from mobile",
                                                             async function () {
            browser.storage.local.set({ "youtube-playlist": "video" });

            const url = new URL("https://m.youtube.com/watch?a=foo");
            const content = undefined;
            const options = { incognito: false };

            const file = await extractVideo(url, content, options);
            assert.strictEqual(file, null);

            browser.storage.local.clear();
        });

        it("should return video id from mobile", async function () {
            browser.storage.local.set({ "youtube-playlist": "playlist" });

            const url = new URL("https://m.youtube.com/watch?v=foo");
            const content = undefined;
            const options = { incognito: false };

            const file = await extractVideo(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/" +
                                               "?video_id=foo&incognito=false");

            browser.storage.local.clear();
        });

        it("should return null when it's not a video from music",
                                                             async function () {
            browser.storage.local.set({ "youtube-playlist": "video" });

            const url = new URL("https://music.youtube.com/watch?m=foo");
            const content = undefined;
            const options = { incognito: false };

            const file = await extractVideo(url, content, options);
            assert.strictEqual(file, null);

            browser.storage.local.clear();
        });

        it("should return video id from music", async function () {
            browser.storage.local.set({ "youtube-playlist": "video" });

            const url = new URL("https://music.youtube.com/watch?v=foo" +
                                                               "&list=bar");
            const content = undefined;
            const options = { incognito: true };

            const file = await extractVideo(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/" +
                                                "?video_id=foo&incognito=true");

            browser.storage.local.clear();
        });

        it("should return video id from invidio.us", async function () {
            browser.storage.local.set({ "youtube-playlist": "video" });

            const url = new URL("https://invidio.us/watch?v=foo");
            const content = undefined;
            const options = { incognito: false };

            const file = await extractVideo(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/" +
                                               "?video_id=foo&incognito=false");

            browser.storage.local.clear();
        });

        it("should return video id from hooktube", async function () {
            browser.storage.local.set({ "youtube-playlist": "video" });

            const url = new URL("https://hooktube.com/watch?v=foo");
            const content = undefined;
            const options = { incognito: true };

            const file = await extractVideo(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/" +
                                                "?video_id=foo&incognito=true");

            browser.storage.local.clear();
        });
    });

    describe("extractPlaylist()", function () {
        it("should return null when it's not a playlist", async function () {
            browser.storage.local.set({ "youtube-order": "" });

            const url = new URL("https://www.youtube.com/playlist?v=foo");
            const content = undefined;
            const options = { incognito: false };

            const file = await extractPlaylist(url, content, options);
            assert.strictEqual(file, null);

            browser.storage.local.clear();
        });

        it("should return playlist id", async function () {
            browser.storage.local.set({ "youtube-order": "" });

            const url = new URL("https://www.youtube.com/playlist?list=foo");
            const content = undefined;
            const options = { incognito: false };

            const file = await extractPlaylist(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/" +
                              "?playlist_id=foo&order=&play=1&incognito=false");

            browser.storage.local.clear();
        });

        it("should return playlist id with shuffle order", async function () {
            browser.storage.local.set({ "youtube-order": "shuffle" });

            const url = new URL("https://www.youtube.com/playlist?list=foo");
            const content = undefined;
            const options = { incognito: false };

            const file = await extractPlaylist(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/" +
                       "?playlist_id=foo&order=shuffle&play=1&incognito=false");

            browser.storage.local.clear();
        });

        it("should return null when it's not a playlist from mobile",
                                                             async function () {
            browser.storage.local.set({ "youtube-order": "reverse" });

            const url = new URL("https://m.youtube.com/playlist" +
                                                            "?video=foo" +
                                                            "&incognito=false");
            const content = undefined;
            const options = { incognito: false };

            const file = await extractPlaylist(url, content, options);
            assert.strictEqual(file, null);

            browser.storage.local.clear();
        });

        it("should return playlist id from mobile", async function () {
            browser.storage.local.set({ "youtube-order": "reverse" });

            const url = new URL("https://m.youtube.com/playlist?list=foo");
            const content = undefined;
            const options = { incognito: true };

            const file = await extractPlaylist(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/" +
                        "?playlist_id=foo&order=reverse&play=1&incognito=true");

            browser.storage.local.clear();
        });
    });

    describe("extractEmbed()", function () {
        it("should return video id", async function () {
            const url = new URL("https://www.youtube.com/embed/foo");
            const content = undefined;
            const options = { incognito: false };

            const file = await extractEmbed(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/" +
                                               "?video_id=foo&incognito=false");
        });

        it("should return video id without cookie", async function () {
            const url = new URL("https://www.youtube-nocookie.com/embed/foo");
            const content = undefined;
            const options = { incognito: true };

            const file = await extractEmbed(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/" +
                                                "?video_id=foo&incognito=true");
        });

        it("should return video id form invidio.us", async function () {
            const url = new URL("https://invidio.us/embed/foo");
            const content = undefined;
            const options = { incognito: false };

            const file = await extractEmbed(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/" +
                                               "?video_id=foo&incognito=false");
        });

        it("should return video id from hooktube", async function () {
            const url = new URL("https://hooktube.com/embed/foo");
            const content = undefined;
            const options = { incognito: true };

            const file = await extractEmbed(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/" +
                                                "?video_id=foo&incognito=true");
        });
    });

    describe("extractMinify()", function () {
        it("should return video id", async function () {
            const url = new URL("https://youtu.be/foo");
            const content = undefined;
            const options = { incognito: false };

            const file = await extractMinify(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/" +
                                               "?video_id=foo&incognito=false");
        });
    });
});
