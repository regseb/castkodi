/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as labeler from "../../../../src/core/labeler/dailymotion.js";

describe("core/labeler/dailymotion.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://careers.dailymotion.com/video/foo");

            const file = await labeler.extract(url);
            assert.equal(file, undefined);
        });

        it("should return video label", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .resolves(Response.json({ title: "foo" }));

            const url = new URL("https://www.dailymotion.com/video/bar");

            const label = await labeler.extract(url);
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://www.dailymotion.com/player/metadata/video/bar",
            ]);
        });
    });
});
