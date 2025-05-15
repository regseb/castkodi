/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import {
    compile,
    matchPattern,
} from "../../../../src/core/tools/matchpattern.js";

describe("core/tools/matchpattern.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("compile()", function () {
        it("should compile magnet pattern", function () {
            const regexp = compile("magnet:?*");
            assert.equal(regexp.source, String.raw`^magnet:\?.*$`);
            assert.ok(regexp.test("magnet:?foo=bar"));
            assert.ok(!regexp.test("qux:?quux"));
        });

        it("should compile acestream pattern", function () {
            const regexp = compile("acestream://*");
            assert.equal(regexp.source, String.raw`^acestream:\/\/.*$`);
            assert.ok(regexp.test("acestream://foo"));
            assert.ok(!regexp.test("baz://qux"));
        });

        it("should compile '*' scheme", function () {
            const regexp = compile("*://foo.com/");
            assert.equal(regexp.source, String.raw`^https?:\/\/foo\.com\/$`);
            assert.ok(regexp.test("http://foo.com/"));
            assert.ok(!regexp.test("bar://baz.com/"));
        });

        it("should compile custom scheme", function () {
            const regexp = compile("ws://foo.com/");
            assert.equal(regexp.source, String.raw`^ws:\/\/foo\.com\/$`);
            assert.ok(regexp.test("ws://foo.com/"));
            assert.ok(!regexp.test("bar://foo.com/"));
        });

        it("should compile '*' host", function () {
            const regexp = compile("https://*/");
            assert.equal(regexp.source, String.raw`^https:\/\/[^/]+\/$`);
            assert.ok(regexp.test("https://foo.com/"));
            assert.ok(!regexp.test("bar://foo.com/"));
        });

        it("should compile '*' in host", function () {
            const regexp = compile("https://*.com/");
            assert.equal(regexp.source, String.raw`^https:\/\/[^./]+\.com\/$`);
            assert.ok(regexp.test("https://foo.com/"));
            assert.ok(!regexp.test("https://foo.fr/"));
        });

        it("should compile custom host", function () {
            const regexp = compile("https://foo.com/");
            assert.equal(regexp.source, String.raw`^https:\/\/foo\.com\/$`);
            assert.ok(regexp.test("https://foo.com/"));
            assert.ok(!regexp.test("https://bar.com/"));
        });

        it("should compile path", function () {
            const regexp = compile("https://foo.com/bar/*/baz/*");
            assert.equal(
                regexp.source,
                String.raw`^https:\/\/foo\.com\/bar\/.*\/baz\/.*$`,
            );
            assert.ok(regexp.test("https://foo.com/bar/qux/baz/quux"));
            assert.ok(!regexp.test("https://foo.com/bar/corge/"));
        });

        it("should be case-insensitive in special schema", function () {
            const regexp = compile("magnet:?foo=bar");
            assert.equal(regexp.source, String.raw`^magnet:\?foo=bar$`);
            assert.ok(regexp.test("MAGNET:?FOO=BAR"));
            assert.ok(!regexp.test("MAGNET:?BAZ=QUX"));
        });

        it("should be case-insensitive in standard schema", function () {
            const regexp = compile("https://*.fr/foo/*");
            assert.equal(
                regexp.source,
                String.raw`^https:\/\/[^./]+\.fr\/foo\/.*$`,
            );
            assert.ok(regexp.test("HTTPS://BAR.FR/FOO/BAZ"));
            assert.ok(!regexp.test("HTTPS://QUX.FR/QUUX/CORGE"));
        });
    });

    describe("matchPattern()", function () {
        it("should support one pattern", async function () {
            const func = mock.fn(() => Promise.resolve("foo"));

            const wrapped = matchPattern(func, "*://bar.fr/");
            assert.deepEqual(
                Object.getOwnPropertyDescriptor(wrapped, "name"),
                Object.getOwnPropertyDescriptor(func, "name"),
            );

            let result = await wrapped(new URL("https://bar.fr/"));
            assert.equal(result, "foo");
            result = await wrapped(new URL("https://baz.org/"));
            assert.equal(result, undefined);

            assert.equal(func.mock.callCount(), 1);
            assert.deepEqual(func.mock.calls[0].arguments, [
                new URL("https://bar.fr/"),
            ]);
        });

        it("should support many patterns", async function () {
            const func = mock.fn(() => Promise.resolve("foo"));

            const wrapped = matchPattern(
                func,
                "*://bar.io/",
                "https://baz.com/",
            );
            let result = await wrapped(new URL("https://bar.io/"));
            assert.equal(result, "foo");
            result = await wrapped(new URL("https://baz.com/"));
            assert.equal(result, "foo");
            result = await wrapped(new URL("https://qux.org/"));
            assert.equal(result, undefined);

            assert.equal(func.mock.callCount(), 2);
            assert.deepEqual(func.mock.calls[0].arguments, [
                new URL("https://bar.io/"),
            ]);
            assert.deepEqual(func.mock.calls[1].arguments, [
                new URL("https://baz.com/"),
            ]);
        });

        it("should support others parameters", async function () {
            const func = mock.fn(() => Promise.resolve("foo"));

            const wrapped = matchPattern(func, "*://bar.com/");
            let result = await wrapped(new URL("https://bar.com/"), "baz");
            assert.equal(result, "foo");
            result = await wrapped(new URL("https://bar.com/"), "baz", "qux");
            assert.equal(result, "foo");
            result = await wrapped(new URL("https://quux.org/"), "corge");
            assert.equal(result, undefined);

            assert.equal(func.mock.callCount(), 2);
            assert.deepEqual(func.mock.calls[0].arguments, [
                new URL("https://bar.com/"),
                "baz",
            ]);
            assert.deepEqual(func.mock.calls[1].arguments, [
                new URL("https://bar.com/"),
                "baz",
                "qux",
            ]);
        });
    });
});
