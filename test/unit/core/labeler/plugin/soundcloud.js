/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as labeler from "../../../../../src/core/labeler/plugin/soundcloud.js";

describe("core/labeler/plugin/soundcloud.js", function () {
    describe("extract()", function () {
        it("should return audio label", async function () {
            const fake = sinon.fake.resolves("foo");

            const url = new URL(
                "plugin://plugin.audio.soundcloud/play/" +
                    "?url=http%3A%2F%2Fbar.com%2F",
            );

            const label = await labeler.extract(url, { metaExtract: fake });
            assert.equal(label, "foo");

            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [new URL("http://bar.com/")]);
        });

        it("should return undefined when there isn't 'url' parameter", async function () {
            const fake = sinon.fake.resolves("foo");

            const url = new URL(
                "plugin://plugin.audio.soundcloud/play/?bar=baz",
            );

            const label = await labeler.extract(url, { metaExtract: fake });
            assert.equal(label, undefined);

            assert.equal(fake.callCount, 0);
        });
    });
});
