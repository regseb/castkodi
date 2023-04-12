/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as labeller from "../../../../../src/core/labeller/plugin/vimeo.js";

describe("core/labeller/plugin/vimeo.js", function () {
    describe("extract()", function () {
        it("should return undefined when there isn't 'video_id' parameter", async function () {
            const fake = sinon.fake.resolves("foo");

            const url = new URL("plugin://plugin.video.vimeo/play/?bar=baz");

            const label = await labeller.extract(url, { metaExtract: fake });
            assert.equal(label, undefined);

            assert.equal(fake.callCount, 0);
        });

        it("should return label", async function () {
            const fake = sinon.fake.resolves("foo");

            const url = new URL(
                "plugin://plugin.video.vimeo/play/?video_id=bar",
            );

            const label = await labeller.extract(url, { metaExtract: fake });
            assert.equal(label, "foo");

            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [
                new URL("https://vimeo.com/bar"),
            ]);
        });

        it("should return label from unlisted", async function () {
            const fake = sinon.fake.resolves("foo");

            const url = new URL(
                "plugin://plugin.video.vimeo/play/?video_id=bar:baz",
            );

            const label = await labeller.extract(url, { metaExtract: fake });
            assert.equal(label, "foo");

            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [
                new URL("https://vimeo.com/bar/baz"),
            ]);
        });
    });
});
