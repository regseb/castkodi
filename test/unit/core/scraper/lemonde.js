import assert from "node:assert";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/lemonde.js";

describe("core/scraper/lemonde.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://journal.lemonde.fr/");

            const file = await scraper.extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when depth is 1", async function () {
            const url = new URL("https://www.lemonde.fr/foo.html");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <video>
                          <source type="video/youtube"
                                  src=="https://www.youtube.com/embed/bar" />
                        </video>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: true };

            const file = await scraper.extract(url, content, options);
            assert.strictEqual(file, null);
        });

        it("should return null when there isn't youtube / dailymotion",
                                                             async function () {
            const url = new URL("https://www.lemonde.fr/foo.html");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };
            const options = { depth: false };

            const file = await scraper.extract(url, content, options);
            assert.strictEqual(file, null);
        });

        it("should return URL from youtube", async function () {
            const url = new URL("https://www.lemonde.fr/foo.html");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <video>
                          <source type="video/youtube"
                                  src="https://www.youtube.com/embed/bar" />
                        </video>
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: false, incognito: true };

            const file = await scraper.extract(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.youtube/play/?video_id=bar" +
                                                   "&incognito=true");
        });

        it("should return URL from dailymotion", async function () {
            const url = new URL("https://www.lemonde.fr/foo.html");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <div data-provider="dailymotion" data-id="bar" />
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: false, incognito: false };

            const file = await scraper.extract(url, content, options);
            assert.strictEqual(file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo" +
                                                      "&url=bar");
        });

        it("should return URL from tiktok", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <body>
                     <script id="__NEXT_DATA__">${JSON.stringify({
                         props: {
                             pageProps: {
                                 itemInfo: {
                                     itemStruct: {
                                         video: {
                                             playAddr: "https://baz.fr/qux.mp4",
                                         },
                                     },
                                 },
                             },
                         },
                     })}</script>
                   </body>
                 </html>`,
                { headers: { "Content-Type": "text/html" } },
            ));

            const url = new URL("https://www.lemonde.fr/foo.html");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <blockquote class="tiktok-embed"
                                    cite="https://www.tiktok.com/bar" />
                      </body>
                    </html>`, "text/html")),
            };
            const options = { depth: false, incognito: false };

            const file = await scraper.extract(url, content, options);
            assert.strictEqual(file, "https://baz.fr/qux.mp4");

            assert.strictEqual(stub.callCount, 1);
            assert.strictEqual(stub.firstCall.args[0],
                               "https://www.tiktok.com/bar");

            stub.restore();
        });
    });
});
