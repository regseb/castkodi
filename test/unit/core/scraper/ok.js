/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/ok.js";

describe("core/scraper/ok.js", function () {
    describe("extractMobile()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://m.ko.ru/video/42");
            const metadata = { html: () => Promise.resolve(undefined) };

            const file = await scraper.extractMobile(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't outLnk", async function () {
            const url = new URL("https://m.ok.ru/video/42");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            "<html><body></body></html>",
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractMobile(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return URL", async function () {
            const url = new URL("https://m.ok.ru/video/42");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <a class="outLnk" data-video="${JSON.stringify({
                                   videoSrc: "https://foo.com/video.mp4",
                               }).replaceAll('"', "&quot;")}" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractMobile(url, metadata);
            assert.equal(file, "https://foo.com/video.mp4");
        });
    });

    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://ko.ru/video/42");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't outLnk", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .resolves(new Response("<html><body></body></html>"));

            const url = new URL("https://ok.ru/video/42");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                new URL("https://m.ok.ru/video/42"),
            ]);
        });

        it("should return URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    `<html><body>
                        <a class="outLnk" data-video="${JSON.stringify({
                            videoSrc: "https://foo.com/video.mp4",
                        }).replaceAll('"', "&quot;")}" />
                     </body></html>`,
                ),
            );

            const url = new URL("https://ok.ru/video/42");

            const file = await scraper.extract(url);
            assert.equal(file, "https://foo.com/video.mp4");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                new URL("https://m.ok.ru/video/42"),
            ]);
        });
    });
});
