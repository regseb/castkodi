import assert from "node:assert/strict";
import sinon from "sinon";
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
            assert.equal(file, url.href);

            assert.equal(stub.callCount, 1);
            assert.equal(stub.firstCall.args.length, 2);
            assert.deepEqual(stub.firstCall.args[0], url);
            assert.equal(typeof stub.firstCall.args[1], "object");
        });

        it("should return undefined when it's not supported and depther",
                                                             async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                "",
                { headers: { "Content-Type": "application/svg+xml" } },
            ));

            const url = new URL("https://foo.com/bar.svg");
            const options = { depth: true, incognito: false };

            const file = await extract(url, options);
            assert.equal(file, undefined);

            assert.equal(stub.callCount, 1);
            assert.equal(stub.firstCall.args.length, 2);
            assert.deepEqual(stub.firstCall.args[0], url);
            assert.equal(typeof stub.firstCall.args[1], "object");
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
            assert.equal(file, "https://foo.com/baz.mp4");

            assert.equal(stub.callCount, 1);
            assert.equal(stub.firstCall.args.length, 2);
            assert.deepEqual(stub.firstCall.args[0], url);
            assert.equal(typeof stub.firstCall.args[1], "object");
        });

        it("should support URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                "",
            ));

            const url = new URL("http://www.dailymotion.com/video/foo");
            const options = { depth: false, incognito: false };

            const file = await extract(url, options);
            assert.ok(file?.startsWith("plugin://plugin.video" +
                                                           ".dailymotion_com/"),
                      `"${file}"?.startsWith(...)`);

            assert.equal(stub.callCount, 1);
        });

        it("should return media URL from dynamic DOM", async function () {
            browser.tabs.create({ _id: 1, url: "http://foo.fr/bar.html" });

            const stubFetch = sinon.stub(globalThis, "fetch")
                                   .resolves(new Response(""));
            const stubExecuteScript = sinon.stub(browser.tabs, "executeScript")
                                           .resolves(["http://foo.fr/baz.mp4"]);

            const url = new URL("http://foo.fr/bar.html");
            const options = { depth: false, incognito: false };

            const file = await extract(url, options);
            assert.equal(file, "http://foo.fr/baz.mp4");

            assert.equal(stubFetch.callCount, 1);
            assert.equal(stubFetch.firstCall.args.length, 2);
            assert.deepEqual(stubFetch.firstCall.args[0], url);
            assert.equal(typeof stubFetch.firstCall.args[1], "object");
            assert.equal(stubExecuteScript.callCount, 1);
            assert.deepEqual(stubExecuteScript.firstCall.args, [
                1, { allFrames: true, file: "/script/extractor.js" },
            ]);
        });

        it("should return media URL from second dynamic DOM",
                                                             async function () {
            browser.tabs.create({ _id: 1, url: "http://foo.fr/bar.html" });
            browser.tabs.create({ _id: 2, url: "http://foo.fr/bar.html" });

            const stubFetch = sinon.stub(globalThis, "fetch")
                                   .resolves(new Response(""));
            const stubExecuteScript = sinon.stub(browser.tabs, "executeScript")
                // Tester aussi avec null car c'est une valeur retournée par
                // Chromium.
                // eslint-disable-next-line unicorn/no-null
                .onFirstCall().resolves([undefined, null])
                .onSecondCall().resolves([undefined, "http://foo.fr/baz.mp4"]);

            const url = new URL("http://foo.fr/bar.html");
            const options = { depth: false, incognito: false };

            const file = await extract(url, options);
            assert.equal(file, "http://foo.fr/baz.mp4");

            assert.equal(stubFetch.callCount, 1);
            assert.equal(stubFetch.firstCall.args.length, 2);
            assert.deepEqual(stubFetch.firstCall.args[0], url);
            assert.equal(typeof stubFetch.firstCall.args[1], "object");
            assert.equal(stubExecuteScript.callCount, 2);
            assert.deepEqual(stubExecuteScript.firstCall.args, [
                1, { allFrames: true, file: "/script/extractor.js" },
            ]);
            assert.deepEqual(stubExecuteScript.secondCall.args, [
                2, { allFrames: true, file: "/script/extractor.js" },
            ]);
        });

        it("should return error from content script", async function () {
            browser.tabs.create({ _id: 1, url: "http://foo.fr/bar.html" });

            const stubFetch = sinon.stub(globalThis, "fetch")
                                   .resolves(new Response(""));
            const stubExecuteScript = sinon.stub(browser.tabs, "executeScript")
                                           .rejects(new Error("Baz"));

            const url = new URL("http://foo.fr/bar.html");
            const options = { depth: false, incognito: false };

            await assert.rejects(() => extract(url, options), {
                name:    "Error",
                message: "Baz",
            });

            assert.equal(stubFetch.callCount, 1);
            assert.equal(stubFetch.firstCall.args.length, 2);
            assert.deepEqual(stubFetch.firstCall.args[0], url);
            assert.equal(typeof stubFetch.firstCall.args[1], "object");
            assert.equal(stubExecuteScript.callCount, 1);
            assert.deepEqual(stubExecuteScript.firstCall.args, [
                1, { allFrames: true, file: "/script/extractor.js" },
            ]);
        });

        it("should ignore error from chrome.google.com/webstore",
                                                             async function () {
            browser.tabs.create({
                _id: 1,
                url: "https://chrome.google.com/webstore/",
            });

            const stubFetch = sinon.stub(globalThis, "fetch")
                                   .resolves(new Response(""));
            const stubExecuteScript = sinon.stub(browser.tabs, "executeScript")
                                           .rejects(new Error(
                "The extensions gallery cannot be scripted.",
            ));

            const url = new URL("https://chrome.google.com/webstore/");
            const options = { depth: false, incognito: false };

            const file = await extract(url, options);
            assert.equal(file, url.href);

            assert.equal(stubFetch.callCount, 1);
            assert.equal(stubFetch.firstCall.args.length, 2);
            assert.deepEqual(stubFetch.firstCall.args[0], url);
            assert.equal(typeof stubFetch.firstCall.args[1], "object");
            assert.equal(stubExecuteScript.callCount, 1);
            assert.deepEqual(stubExecuteScript.firstCall.args, [
                1, { allFrames: true, file: "/script/extractor.js" },
            ]);
        });

        it("should ignore error from addons.mozilla.org", async function () {
            browser.tabs.create({ _id: 1, url: "https://addons.mozilla.org/" });

            const stubFetch = sinon.stub(globalThis, "fetch")
                                   .resolves(new Response(""));
            const stubExecuteScript = sinon.stub(browser.tabs, "executeScript")
                                           .rejects(new Error(
                "Missing host permission for the tab, and any iframes",
            ));

            const url = new URL("https://addons.mozilla.org/");
            const options = { depth: false, incognito: false };

            const file = await extract(url, options);
            assert.equal(file, url.href);

            assert.equal(stubFetch.callCount, 1);
            assert.equal(stubFetch.firstCall.args.length, 2);
            assert.deepEqual(stubFetch.firstCall.args[0], url);
            assert.equal(typeof stubFetch.firstCall.args[1], "object");
            assert.equal(stubExecuteScript.callCount, 1);
            assert.deepEqual(stubExecuteScript.firstCall.args, [
                1, { allFrames: true, file: "/script/extractor.js" },
            ]);
        });

        it("should support uppercase URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                "<html></html>",
                { headers: { "Content-Type": "application/xhtml+xml" } },
            ));

            const url = new URL("HTTPS://PLAYER.VIMEO.COM/VIDEO/foo");
            const options = { depth: false, incognito: false };

            const file = await extract(url, options);
            assert.ok(file?.startsWith("plugin://plugin.video.vimeo/"),
                      `"${file}"?.startsWith(...)`);

            assert.equal(stub.callCount, 1);
        });
    });
});
