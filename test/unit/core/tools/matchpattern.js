/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import {
    compile,
    matchPattern,
} from "../../../../src/core/tools/matchpattern.js";

describe("core/tools/matchpattern.js", function () {
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
            const regexp = compile("http://*/");
            assert.equal(regexp.source, String.raw`^http:\/\/[^/]+\/$`);
            assert.ok(regexp.test("http://foo.com/"));
            assert.ok(!regexp.test("bar://foo.com/"));
        });

        it("should compile '*' in host", function () {
            const regexp = compile("http://*.com/");
            assert.equal(regexp.source, String.raw`^http:\/\/[^./]+\.com\/$`);
            assert.ok(regexp.test("http://foo.com/"));
            assert.ok(!regexp.test("http://foo.fr/"));
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
            const fake = sinon.fake.resolves("foo");

            const wrapped = matchPattern(fake, "*://bar.com/");
            assert.deepEqual(
                Object.getOwnPropertyDescriptor(wrapped, "name"),
                Object.getOwnPropertyDescriptor(fake, "name"),
            );

            let result = await wrapped(new URL("http://bar.com/"));
            assert.equal(result, "foo");
            result = await wrapped(new URL("http://baz.org/"));
            assert.equal(result, undefined);

            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [new URL("http://bar.com/")]);
        });

        it("should support many patterns", async function () {
            const fake = sinon.fake.resolves("foo");

            const wrapped = matchPattern(
                fake,
                "*://bar.com/",
                "http://baz.io/",
            );
            let result = await wrapped(new URL("http://bar.com/"));
            assert.equal(result, "foo");
            result = await wrapped(new URL("http://baz.io/"));
            assert.equal(result, "foo");
            result = await wrapped(new URL("http://qux.org/"));
            assert.equal(result, undefined);

            assert.equal(fake.callCount, 2);
            assert.deepEqual(fake.firstCall.args, [new URL("http://bar.com/")]);
            assert.deepEqual(fake.secondCall.args, [new URL("http://baz.io/")]);
        });

        it("should support others parameters", async function () {
            const fake = sinon.fake.resolves("foo");

            const wrapped = matchPattern(fake, "*://bar.com/");
            let result = await wrapped(new URL("http://bar.com/"), "baz");
            assert.equal(result, "foo");
            result = await wrapped(new URL("http://bar.com/"), "baz", "qux");
            assert.equal(result, "foo");
            result = await wrapped(new URL("http://quux.org/"), "corge");
            assert.equal(result, undefined);

            assert.equal(fake.callCount, 2);
            assert.deepEqual(fake.firstCall.args, [
                new URL("http://bar.com/"),
                "baz",
            ]);
            assert.deepEqual(fake.secondCall.args, [
                new URL("http://bar.com/"),
                "baz",
                "qux",
            ]);
        });
    });
});
