import assert      from "assert";
import sinon       from "sinon";
import { extract } from "../../../src/core/scrapers.js";

describe("core/scrapers.js", function () {
    describe("extract()", function () {
        it("should return URL when it's not supported", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                "",
                { headers: { "Content-Type": "application/svg+xml" } },
            ));

            const url = "https://kodi.tv/site/default/themes/kodi/logo-sbs.svg";
            const options = { depth: 0, incognito: false };

            const file = await extract(new URL(url), options);
            assert.strictEqual(file, url);

            assert.strictEqual(stub.callCount, 1);
            assert.strictEqual(stub.firstCall.args[0], url);
            assert.strictEqual(typeof stub.firstCall.args[1], "object");

            stub.restore();
        });

        it("should return media URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <body>
                     <video src="/baz.mp4" />
                   </body>
                 </html>`,
                { headers: { "Content-Type": "text/html;charset=utf-8" } },
            ));

            const url = "https://foo.com/bar.html";
            const options = { depth: 0, incognito: false };

            const file = await extract(new URL(url), options);
            assert.strictEqual(file, "https://foo.com/baz.mp4");

            assert.strictEqual(stub.callCount, 1);
            assert.strictEqual(stub.firstCall.args[0], url);
            assert.strictEqual(typeof stub.firstCall.args[1], "object");

            stub.restore();
        });

        it("should support URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                "",
            ));

            const url = "http://www.dailymotion.com/video/x17qw0a";
            const options = { depth: 0, incognito: false };

            const file = await extract(new URL(url), options);
            assert.ok(file.startsWith("plugin://plugin.video.dailymotion_com/"),
                      `"${file}".startsWith(...)`);

            assert.strictEqual(stub.callCount, 0);

            stub.restore();
        });

        it("should support uppercase URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                "<html></html>",
                { headers: { "Content-Type": "application/xhtml+xml" } },
            ));

            const url = "HTTPS://VIMEO.COM/195613867";
            const options = { depth: 0, incognito: false };

            const file = await extract(new URL(url), options);
            assert.ok(file.startsWith("plugin://plugin.video.vimeo/"),
                      `"${file}".startsWith(...)`);

            assert.strictEqual(stub.callCount, 0);

            stub.restore();
        });
    });
});
