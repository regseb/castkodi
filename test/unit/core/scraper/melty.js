/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
import * as scraper from "../../../../src/core/scraper/melty.js";

describe("core/scraper/melty.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.melty.com/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it's depth", async function () {
            const url = new URL("https://www.melty.fr/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <script>
                                 jQuery(document).ready(function (){
                                     init_nouveau_player_dailymotion(` +
                                `"player_bar","baz", params);
                               </script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: true };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't video", async function () {
            const url = new URL("https://www.melty.fr/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <script src="bar.js"></script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return URL", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://www.melty.fr/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <script>
                                 jQuery(document).ready(function (){
                                     console.log("bar");
                               </script>
                               <script>
                                 jQuery(document).ready(function (){
                                     init_nouveau_player_dailymotion(` +
                                `"player_baz","qux", params);
                               </script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=qux",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });
    });
});
