/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as labeller from "../../../../../src/core/labeller/plugin/youtube.js";

describe("core/labeller/plugin/youtube.js", function () {
    describe("extract()", function () {
        it("should return video label", async function () {
            const fake = sinon.fake.resolves("foo");

            const url = new URL(
                "plugin://plugin.video.youtube/play/?video_id=bar",
            );

            const label = await labeller.extract(url, { metaExtract: fake });
            assert.equal(label, "foo");

            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [
                new URL("https://www.youtube.com/watch?v=bar"),
            ]);
        });

        it("should return playlist label", async function () {
            const fake = sinon.fake.resolves("foo");

            const url = new URL(
                "plugin://plugin.video.youtube/play/" +
                    "?playlist_id=bar&order=&play=1&incognito=false",
            );

            const label = await labeller.extract(url, { metaExtract: fake });
            assert.equal(label, "foo");

            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [
                new URL("https://www.youtube.com/playlist?list=bar"),
            ]);
        });

        it("should return undefined when there isn't parameter from YouTube", async function () {
            const fake = sinon.fake.resolves("foo");

            const url = new URL("plugin://plugin.video.youtube/play/?bar=baz");

            const label = await labeller.extract(url, { metaExtract: fake });
            assert.equal(label, undefined);

            assert.equal(fake.callCount, 0);
        });
    });
});
