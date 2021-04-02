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

            const url = new URL("https://foo.com/bar.svg");
            const options = { depth: false, incognito: false };

            const file = await extract(url, options);
            assert.strictEqual(file, url.href);

            assert.strictEqual(stub.callCount, 1);
            assert.strictEqual(stub.firstCall.args[0], url.href);
            assert.strictEqual(typeof stub.firstCall.args[1], "object");

            stub.restore();
        });

        it("should return null when it's not supported and depther",
                                                             async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                "",
                { headers: { "Content-Type": "application/svg+xml" } },
            ));

            const url = new URL("https://foo.com/bar.svg");
            const options = { depth: true, incognito: false };

            const file = await extract(url, options);
            assert.strictEqual(file, null);

            assert.strictEqual(stub.callCount, 1);
            assert.strictEqual(stub.firstCall.args[0], url.href);
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

            const url = new URL("https://foo.com/bar.html");
            const options = { depth: false, incognito: false };

            const file = await extract(url, options);
            assert.strictEqual(file, "https://foo.com/baz.mp4");

            assert.strictEqual(stub.callCount, 1);
            assert.strictEqual(stub.firstCall.args[0], url.href);
            assert.strictEqual(typeof stub.firstCall.args[1], "object");

            stub.restore();
        });

        it("should support URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                "",
            ));

            const url = new URL("http://www.dailymotion.com/video/x17qw0a");
            const options = { depth: false, incognito: false };

            const file = await extract(url, options);
            assert.ok(file?.startsWith("plugin://plugin.video" +
                                                           ".dailymotion_com/"),
                      `"${file}"?.startsWith(...)`);

            assert.strictEqual(stub.callCount, 0);

            stub.restore();
        });

        it("should support uppercase URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                "<html></html>",
                { headers: { "Content-Type": "application/xhtml+xml" } },
            ));

            const url = new URL("HTTPS://PLAYER.VIMEO.COM/VIDEO/12345");
            const options = { depth: false, incognito: false };

            const file = await extract(url, options);
            assert.ok(file?.startsWith("plugin://plugin.video.vimeo/"),
                      `"${file}"?.startsWith(...)`);

            assert.strictEqual(stub.callCount, 0);

            stub.restore();
        });
    });
});
