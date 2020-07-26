import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: TikTok", function () {
    it("should return URL when it's not a video", async function () {
        const url = new URL("https://www.tiktok.com/about?lang=fr");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return video URL", async function () {
        const url = new URL("https://www.tiktok.com/@the90guy/video" +
                                         "/6710341586984635654?langCountry=fr");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(file.endsWith("&lr=tiktok_m&mime_type=video_mp4&qs=0" +
                    "&rc=ampvbHJwdnV4bjMzOjczM0ApPDM7OGU0aWU3NzM8aTY1PGc0azNh" +
                    "bmpja2NfLS0zMTZzczI1LzQyMF8yYV81X141LS06Yw%3D%3D&vl=&vr="),
                  `"${file}".endsWith(...)`);
    });

    it("should return video when protocol is HTTP", async function () {
        const url = new URL("http://www.tiktok.com/@the90guy/video" +
                                                        "/6710341586984635654");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(file.endsWith("&lr=tiktok_m&mime_type=video_mp4&qs=0" +
                    "&rc=ampvbHJwdnV4bjMzOjczM0ApPDM7OGU0aWU3NzM8aTY1PGc0azNh" +
                    "bmpja2NfLS0zMTZzczI1LzQyMF8yYV81X141LS06Yw%3D%3D&vl=&vr="),
                  `"${file}".endsWith(...)`);
    });
});
