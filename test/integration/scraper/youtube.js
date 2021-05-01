import assert from "node:assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: YouTube", function () {
    it("should return URL when it's not a video", async function () {
        browser.storage.local.set({ "youtube-playlist": "playlist" });

        const url = new URL("https://www.youtube.com/watch?x=123456");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);

        browser.storage.local.clear();
    });

    it("should return playlist id from video in playlist", async function () {
        browser.storage.local.set({
            "youtube-playlist": "playlist",
            "youtube-order":    "default",
        });

        const url = new URL("https://www.youtube.com/watch?v=avt4ZWlVjdY" +
                                    "&list=PL7nedIL_qbuZBS5ZAiGkjB1LW9C3zZvum");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.youtube/play/" +
                             "?playlist_id=PL7nedIL_qbuZBS5ZAiGkjB1LW9C3zZvum" +
                                       "&order=default&play=1&incognito=false");

        browser.storage.local.clear();
    });

    it("should return video id", async function () {
        browser.storage.local.set({ "youtube-playlist": "video" });

        const url = new URL("https://www.youtube.com/watch?v=avt4ZWlVjdY" +
                                    "&list=PL7nedIL_qbuZBS5ZAiGkjB1LW9C3zZvum");
        const options = { depth: false, incognito: true };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.youtube/play/" +
                                        "?video_id=avt4ZWlVjdY&incognito=true");

        browser.storage.local.clear();
    });

    it("should return video id even with playlist option", async function () {
        browser.storage.local.set({ "youtube-playlist": "playlist" });

        const url = new URL("https://www.youtube.com/watch?v=sWfAtMQa_yo");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.youtube/play/" +
                                       "?video_id=sWfAtMQa_yo&incognito=false");

        browser.storage.local.clear();
    });

    it("should return video id when protocol is HTTP", async function () {
        browser.storage.local.set({ "youtube-playlist": "playlist" });

        const url = new URL("http://www.youtube.com/watch?v=sWfAtMQa_yo");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.youtube/play/" +
                                       "?video_id=sWfAtMQa_yo&incognito=false");

        browser.storage.local.clear();
    });

    it("should return URL when it's not a video from mobile",
                                                             async function () {
        browser.storage.local.set({ "youtube-playlist": "video" });

        const url = new URL("https://m.youtube.com/watch?a=dQw4w9WgXcQ");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);

        browser.storage.local.clear();
    });

    it("should return video id from mobile", async function () {
        browser.storage.local.set({ "youtube-playlist": "playlist" });

        const url = new URL("https://m.youtube.com/watch?v=dQw4w9WgXcQ");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.youtube/play/" +
                                       "?video_id=dQw4w9WgXcQ&incognito=false");

        browser.storage.local.clear();
    });

    it("should return URL when it's not a video from music", async function () {
        browser.storage.local.set({ "youtube-playlist": "video" });

        const url = new URL("https://music.youtube.com/watch?m=abcdef");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);

        browser.storage.local.clear();
    });

    it("should return video id from music", async function () {
        browser.storage.local.set({ "youtube-playlist": "video" });

        const url = new URL("https://music.youtube.com/watch?v=IOqxarVWKRs" +
                                                     "&list=RDAMVMIOqxarVWKRs");
        const options = { depth: false, incognito: true };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.youtube/play/" +
                                        "?video_id=IOqxarVWKRs&incognito=true");

        browser.storage.local.clear();
    });

    it("should return URL when it's not a playlist", async function () {
        const url = new URL("https://www.youtube.com/playlist?v=dQw4w9WgXcQ");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return playlist id", async function () {
        browser.storage.local.set({ "youtube-order": "" });

        const url = new URL("https://www.youtube.com/playlist" +
                                    "?list=PLd8UclkuwTj9vaRGP3859UHcdmlrkAd-9");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.youtube/play/" +
                             "?playlist_id=PLd8UclkuwTj9vaRGP3859UHcdmlrkAd-9" +
                                              "&order=&play=1&incognito=false");

        browser.storage.local.clear();
    });

    it("should return URL when it's not a playlist from mobile",
                                                             async function () {
        const url = new URL("https://m.youtube.com/playlist" +
                                                   "?video=PL3A5849BDE0581B19");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return playlist id from mobile", async function () {
        browser.storage.local.set({ "youtube-order": "reverse" });

        const url = new URL("https://m.youtube.com/playlist" +
                                                    "?list=PL3A5849BDE0581B19");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.youtube/play/" +
                                             "?playlist_id=PL3A5849BDE0581B19" +
                                       "&order=reverse&play=1&incognito=false");

        browser.storage.local.clear();
    });

    it("should return embed video id", async function () {
        const url = new URL("https://www.youtube.com/embed/v3gefWEggSc");
        const options = { depth: false, incognito: true };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.youtube/play/" +
                                        "?video_id=v3gefWEggSc&incognito=true");
    });

    it("should return video id without cookie", async function () {
        const url = new URL("https://www.youtube-nocookie.com/embed" +
                                                                "/u9gVaeb9le4");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.youtube/play/" +
                                       "?video_id=u9gVaeb9le4&incognito=false");
    });

    it("should return video id from tiny URL", async function () {
        const url = new URL("https://youtu.be/NSFbekvYOlI");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.youtube/play/" +
                                       "?video_id=NSFbekvYOlI&incognito=false");
    });
});
