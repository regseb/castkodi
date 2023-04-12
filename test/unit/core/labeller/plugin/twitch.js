/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as labeller from "../../../../../src/core/labeller/plugin/twitch.js";

describe("core/labeller/plugin/twitch.js", function () {
    describe("extract()", function () {
        it("should return live label", async function () {
            const fake = sinon.fake.resolves("foo");

            const url = new URL(
                "plugin://plugin.video.twitch/?channel_name=bar",
            );

            const label = await labeller.extract(url, { metaExtract: fake });
            assert.equal(label, "foo");

            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [
                new URL("https://www.twitch.tv/bar"),
            ]);
        });

        it("should return video label", async function () {
            const fake = sinon.fake.resolves("foo");

            const url = new URL("plugin://plugin.video.twitch/?video_id=bar");

            const label = await labeller.extract(url, { metaExtract: fake });
            assert.equal(label, "foo");

            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [
                new URL("https://www.twitch.tv/videos/bar"),
            ]);
        });

        it("should return clip label", async function () {
            const fake = sinon.fake.resolves("foo");

            const url = new URL("plugin://plugin.video.twitch/?slug=bar");

            const label = await labeller.extract(url, { metaExtract: fake });
            assert.equal(label, "foo");

            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [
                new URL("https://www.twitch.tv/clip/bar"),
            ]);
        });

        it("should return undefined when there isn't parameter", async function () {
            const fake = sinon.fake.resolves("foo");

            const url = new URL("plugin://plugin.video.twitch/");

            const label = await labeller.extract(url, { metaExtract: fake });
            assert.equal(label, undefined);

            assert.equal(fake.callCount, 0);
        });
    });
});
