/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as labeler from "../../../../src/core/labeler/twitch.js";

describe("core/labeler/twitch.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://appeals.twitch.tv/");

            const file = await labeler.extract(url);
            assert.equal(file, undefined);
        });

        it("should return label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    `<html><head>
                       <title>foo - Twitch</title>
                     </head></html>`,
                ),
            );

            const url = new URL("https://www.twitch.tv/bar");

            const label = await labeler.extract(url);
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["https://m.twitch.tv/bar"]);
        });
    });
});
