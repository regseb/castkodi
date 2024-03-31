/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as labeler from "../../../../../src/core/labeler/plugin/tubed.js";

describe("core/labeler/plugin/tubed.js", function () {
    describe("extract()", function () {
        it("should return video label", async function () {
            const fake = sinon.fake.resolves("foo");

            const url = new URL(
                "plugin://plugin.video.tubed/?mode=play&video_id=bar",
            );

            const label = await labeler.extract(url, { metaExtract: fake });
            assert.equal(label, "foo");

            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [
                new URL("https://www.youtube.com/watch?v=bar"),
            ]);
        });

        it("should return playlist label", async function () {
            const fake = sinon.fake.resolves("foo");

            const url = new URL(
                "plugin://plugin.video.tubed/?mode=play&playlist_id=bar",
            );

            const label = await labeler.extract(url, { metaExtract: fake });
            assert.equal(label, "foo");

            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [
                new URL("https://www.youtube.com/playlist?list=bar"),
            ]);
        });

        it("should return undefined when there isn't parameter from Tubed", async function () {
            const fake = sinon.fake.resolves("foo");

            const url = new URL(
                "plugin://plugin.video.tubed/?mode=play&bar=baz",
            );

            const label = await labeler.extract(url, { metaExtract: fake });
            assert.equal(label, undefined);

            assert.equal(fake.callCount, 0);
        });
    });
});
