/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import { complete, extract, strip } from "../../../src/core/labelers.js";
import "../setup.js";

describe("core/labelers.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("strip()", () => {
        it("should strip [B] tag", () => {
            const text = "foo [B]bar[/B]";
            const stripped = strip(text);
            assert.equal(stripped, "foo bar");
        });

        it("should strip [I] tag", () => {
            const text = "[I]foo[/I] bar";
            const stripped = strip(text);
            assert.equal(stripped, "foo bar");
        });

        it("should strip [LIGHT] tag", () => {
            const text = "[LIGHT]foo[/LIGHT]";
            const stripped = strip(text);
            assert.equal(stripped, "foo");
        });

        it("should strip [COLOR] tag", () => {
            const text = "foo [COLOR red]bar[/COLOR]";
            const stripped = strip(text);
            assert.equal(stripped, "foo bar");
        });

        it("should strip [UPPERCASE] tag", () => {
            const text = "[UPPERCASE]fOoBaR[/UPPERCASE] bAzQuX";
            const stripped = strip(text);
            assert.equal(stripped, "FOOBAR bAzQuX");
        });

        it("should strip [LOWERCASE] tag", () => {
            const text = "fOoBaR [LOWERCASE]bAzQuX[/LOWERCASE]";
            const stripped = strip(text);
            assert.equal(stripped, "fOoBaR bazqux");
        });

        it("should strip [CAPITALIZE] tag", () => {
            const text = "[CAPITALIZE]fOoBaR[/CAPITALIZE] bAzQuX";
            const stripped = strip(text);
            assert.equal(stripped, "FOoBaR bAzQuX");
        });

        it("should strip [CR] tag", () => {
            const text = "foo[CR]bar";
            const stripped = strip(text);
            assert.equal(stripped, "foo bar");
        });

        it("should strip [TABS] tag", () => {
            const text = "foo[TABS]13[/TABS]bar";
            const stripped = strip(text);
            assert.equal(stripped, "foo\t\t\t\t\t\t\t\t\t\t\t\t\tbar");
        });

        it("should strip two same tags", () => {
            const text = "[I]foo[/I][I]bar[/I]";
            const stripped = strip(text);
            assert.equal(stripped, "foobar");
        });

        it("should strip many tags", () => {
            const text = "[B]foo [COLOR blue]bar[/COLOR][CR][/B]";
            const stripped = strip(text);
            assert.equal(stripped, "foo bar");
        });

        it("should trim", () => {
            const text = " foo  ";
            const stripped = strip(text);
            assert.equal(stripped, "foo");
        });
    });

    describe("extract()", () => {
        it("should return label", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    new Response(
                        `<html lang="en"><head>
                           <meta property="og:title" content="bar" />
                         </head></html>`,
                    ),
                ),
            );

            const url = new URL(
                "plugin://plugin.video.youtube/play/?video_id=foo",
            );

            const label = await extract(url);
            assert.equal(label, "bar");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                new URL("https://www.youtube.com/watch?v=foo"),
            ]);
        });

        it("should return undefined", async () => {
            const url = new URL("https://foo.com/");

            const label = await extract(url);
            assert.equal(label, undefined);
        });
    });

    describe("complete()", () => {
        it("should return 'title' when it's present", async () => {
            const item = {
                file: "https://foo.com/",
                label: "bar",
                position: 0,
                title: "baz",
                type: "",
            };

            const result = await complete(item);
            assert.deepEqual(result, {
                file: "https://foo.com/",
                label: "baz",
                position: 0,
                title: "baz",
                type: "",
            });
        });

        it("should return 'title' striped", async () => {
            const item = {
                file: "https://foo.com/",
                label: "bar",
                position: 0,
                title: "[B]baz[/B]",
                type: "",
            };

            const result = await complete(item);
            assert.deepEqual(result, {
                file: "https://foo.com/",
                label: "baz",
                position: 0,
                title: "[B]baz[/B]",
                type: "",
            });
        });

        it("should return 'label' when no labeler", async () => {
            const item = {
                file: "https://foo.com/",
                label: "bar",
                position: 0,
                title: "",
                type: "",
            };

            const result = await complete(item);
            assert.deepEqual(result, {
                file: "https://foo.com/",
                label: "bar",
                position: 0,
                title: "",
                type: "",
            });
        });

        it("should return 'file' when no labeler and no 'label'", async () => {
            const item = {
                file: "https://foo.com/",
                label: "",
                position: 0,
                title: "",
                type: "",
            };

            const result = await complete(item);
            assert.deepEqual(result, {
                file: "https://foo.com/",
                label: "https://foo.com/",
                position: 0,
                title: "",
                type: "",
            });
        });

        it("should return 'label' from labeler", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    new Response(
                        `<html lang="en"><head>
                           <meta property="og:title" content="bar" />
                         </head></html>`,
                    ),
                ),
            );

            const item = {
                file: "plugin://plugin.video.youtube/play/?video_id=foo",
                label: "baz",
                position: 0,
                title: "",
                type: "",
            };

            const result = await complete(item);
            assert.deepEqual(result, {
                file: "plugin://plugin.video.youtube/play/?video_id=foo",
                label: "bar",
                position: 0,
                title: "",
                type: "",
            });

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                new URL("https://www.youtube.com/watch?v=foo"),
            ]);
        });

        it("should support local file", async () => {
            const item = {
                file: "/foo/bar.mp3",
                label: "",
                position: 0,
                title: "",
                type: "",
            };

            const result = await complete(item);
            assert.deepEqual(result, {
                file: "/foo/bar.mp3",
                label: "/foo/bar.mp3",
                position: 0,
                title: "",
                type: "",
            });
        });

        it("should strip tags in label", async () => {
            const item = {
                file: "/foo.mkv",
                label: "[B][UPPERCASE]Bar[/UPPERCASE][/B] !",
                position: 0,
                title: "",
                type: "",
            };

            const result = await complete(item);
            assert.deepEqual(result, {
                file: "/foo.mkv",
                label: "BAR !",
                position: 0,
                title: "",
                type: "",
            });
        });
    });
});
