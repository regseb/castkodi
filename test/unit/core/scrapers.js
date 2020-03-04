import assert      from "assert";
import sinon       from "sinon";
import { extract } from "../../../src/core/scrapers.js";

describe("core/scrapers.js", function () {
    afterEach(function () {
        sinon.restore();
    });

    describe("extract()", function () {
        it("should return URL when it's not supported", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({
                headers: { get: () => "application/svg+xml" },
            }));

            const url = "https://kodi.tv/site/default/themes/kodi/logo-sbs.svg";
            const options = { depth: 0 };
            const expected = url;

            const file = await extract(new URL(url), options);
            assert.strictEqual(file, expected);
        });

        it("should return media URL", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({
                headers: { get: () => "text/html;charset=utf-8" },
                text:    () => `
                    <html>
                    <body>
                        <video src="/baz.mp4" />
                    </body>
                    </html>`,
            }));

            const url = "https://foo.com/bar.html";
            const options = { depth: 0 };
            const expected = "https://foo.com/baz.mp4";

            const file = await extract(new URL(url), options);
            assert.strictEqual(file, expected);
        });

        it("should support URL", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({
                headers: { get: () => null },
            }));

            const url = "http://www.dailymotion.com/video/x17qw0a";
            const options = { depth: 0 };
            const expected = "plugin://plugin.video.dailymotion_com/";

            const file = await extract(new URL(url), options);
            assert.ok(file.startsWith(expected),
                      `"${file}".startsWith(expected)`);
        });

        it("should support uppercase URL", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({
                headers: { get: () => "application/xhtml+xml" },
                text:    () => "<html></html>",
            }));

            const url = "HTTPS://VIMEO.COM/195613867";
            const options = { depth: 0 };
            const expected = "plugin://plugin.video.vimeo/";

            const file = await extract(new URL(url), options);
            assert.ok(file.startsWith(expected),
                      `"${file}".startsWith(expected)`);
        });
    });
});
