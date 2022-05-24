import assert from "node:assert";
import sinon from "sinon";
import { compile, matchPattern }
                              from "../../../../src/core/tools/matchpattern.js";

describe("tools/matchpattern.js", function () {
    describe("compile()", function () {
        it("should compile magnet pattern", function () {
            const regexp = compile("magnet:?*");
            assert.strictEqual(regexp.source, "^magnet:\\?.*$");
            assert.ok(regexp.test("magnet:?foo=bar"));
            assert.ok(!regexp.test("qux:?quux"));
        });

        it("should compile acestream pattern", function () {
            const regexp = compile("acestream://*");
            assert.strictEqual(regexp.source, "^acestream:\\/\\/.*$");
            assert.ok(regexp.test("acestream://foo"));
            assert.ok(!regexp.test("baz://qux"));
        });

        it("should compile '*' scheme", function () {
            const regexp = compile("*://foo.com/");
            assert.strictEqual(regexp.source, "^https?:\\/\\/foo\\.com\\/$");
            assert.ok(regexp.test("http://foo.com/"));
            assert.ok(!regexp.test("bar://baz.com/"));
        });

        it("should compile custom scheme", function () {
            const regexp = compile("ws://foo.com/");
            assert.strictEqual(regexp.source, "^ws:\\/\\/foo\\.com\\/$");
            assert.ok(regexp.test("ws://foo.com/"));
            assert.ok(!regexp.test("bar://foo.com/"));
        });

        it("should compile '*' host", function () {
            const regexp = compile("http://*/");
            assert.strictEqual(regexp.source, "^http:\\/\\/[^/]+\\/$");
            assert.ok(regexp.test("http://foo.com/"));
            assert.ok(!regexp.test("bar://foo.com/"));
        });

        it("should compile '*' in host", function () {
            const regexp = compile("http://*.com/");
            assert.strictEqual(regexp.source, "^http:\\/\\/[^./]+\\.com\\/$");
            assert.ok(regexp.test("http://foo.com/"));
            assert.ok(!regexp.test("http://foo.fr/"));
        });

        it("should compile custom host", function () {
            const regexp = compile("https://foo.com/");
            assert.strictEqual(regexp.source, "^https:\\/\\/foo\\.com\\/$");
            assert.ok(regexp.test("https://foo.com/"));
            assert.ok(!regexp.test("https://bar.com/"));
        });

        it("should compile path", function () {
            const regexp = compile("https://foo.com/bar/*/baz/*");
            assert.strictEqual(regexp.source,
                               "^https:\\/\\/foo\\.com\\/bar\\/.*\\/baz\\/.*$");
            assert.ok(regexp.test("https://foo.com/bar/qux/baz/quux"));
            assert.ok(!regexp.test("https://foo.com/bar/corge/"));
        });

        it("should be case-insensitive in special schema", function () {
            const regexp = compile("magnet:?foo=bar");
            assert.strictEqual(regexp.source, "^magnet:\\?foo=bar$");
            assert.ok(regexp.test("MAGNET:?FOO=BAR"));
            assert.ok(!regexp.test("MAGNET:?BAZ=QUX"));
        });

        it("should be case-insensitive in standard schema", function () {
            const regexp = compile("https://*.fr/foo/*");
            assert.strictEqual(regexp.source,
                               "^https:\\/\\/[^./]+\\.fr\\/foo\\/.*$");
            assert.ok(regexp.test("HTTPS://BAR.FR/FOO/BAZ"));
            assert.ok(!regexp.test("HTTPS://QUX.FR/QUUX/CORGE"));
        });
    });

    describe("matchPattern()", function () {
        it("should support one pattern", async function () {
            const fake = sinon.fake.resolves("foo");

            const wrapped = matchPattern(fake, "*://bar.com/");
            assert.deepStrictEqual(
                Object.getOwnPropertyDescriptor(wrapped, "name"),
                Object.getOwnPropertyDescriptor(fake, "name"),
            );

            let result = await wrapped(new URL("http://bar.com/"));
            assert.strictEqual(result, "foo");
            result = await wrapped(new URL("http://baz.org/"));
            assert.strictEqual(result, undefined);

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                new URL("http://bar.com/"),
            ]);
        });

        it("should support many patterns", async function () {
            const fake = sinon.fake.resolves("foo");

            const wrapped = matchPattern(
                fake, "*://bar.com/", "http://baz.io/",
            );
            let result = await wrapped(new URL("http://bar.com/"));
            assert.strictEqual(result, "foo");
            result = await wrapped(new URL("http://baz.io/"));
            assert.strictEqual(result, "foo");
            result = await wrapped(new URL("http://qux.org/"));
            assert.strictEqual(result, undefined);

            assert.strictEqual(fake.callCount, 2);
            assert.deepStrictEqual(fake.firstCall.args, [
                new URL("http://bar.com/"),
            ]);
            assert.deepStrictEqual(fake.secondCall.args, [
                new URL("http://baz.io/"),
            ]);
        });

        it("should support others parameters", async function () {
            const fake = sinon.fake.resolves("foo");

            const wrapped = matchPattern(fake, "*://bar.com/");
            let result = await wrapped(new URL("http://bar.com/"), "baz");
            assert.strictEqual(result, "foo");
            result = await wrapped(new URL("http://bar.com/"), "baz", "qux");
            assert.strictEqual(result, "foo");
            result = await wrapped(new URL("http://quux.org/"), "corge");
            assert.strictEqual(result, undefined);

            assert.strictEqual(fake.callCount, 2);
            assert.deepStrictEqual(fake.firstCall.args, [
                new URL("http://bar.com/"),
                "baz",
            ]);
            assert.deepStrictEqual(fake.secondCall.args, [
                new URL("http://bar.com/"),
                "baz",
                "qux",
            ]);
        });
    });
});
