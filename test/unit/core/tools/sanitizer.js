import assert from "node:assert/strict";
import { quote, strip } from "../../../../src/core/tools/sanitizer.js";

describe("core/tools/sanitizer.js", function () {
    describe("quote()", function () {
        it("should quote", function () {
            const quoted = quote("foo[.*+?^${}()|[]\\bar");
            assert.equal(quoted,
                "foo\\[\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\bar");
        });

        it("should sanitize empty string", function () {
            const quoted = quote("");
            assert.equal(quoted, "");
        });
    });

    describe("strip()", function () {
        it("should strip [B] tag", function () {
            const text = "foo [B]bar[/B]";
            const stripped = strip(text);
            assert.equal(stripped, "foo bar");
        });

        it("should strip [I] tag", function () {
            const text = "[I]foo[/I] bar";
            const stripped = strip(text);
            assert.equal(stripped, "foo bar");
        });

        it("should strip [LIGHT] tag", function () {
            const text = "[LIGHT]foo[/LIGHT]";
            const stripped = strip(text);
            assert.equal(stripped, "foo");
        });

        it("should strip [COLOR] tag", function () {
            const text = "foo [COLOR red]bar[/COLOR]";
            const stripped = strip(text);
            assert.equal(stripped, "foo bar");
        });

        it("should strip [UPPERCASE] tag", function () {
            const text = "[UPPERCASE]fOoBaR[/UPPERCASE] bAzQuX";
            const stripped = strip(text);
            assert.equal(stripped, "FOOBAR bAzQuX");
        });

        it("should strip [LOWERCASE] tag", function () {
            const text = "fOoBaR [LOWERCASE]bAzQuX[/LOWERCASE]";
            const stripped = strip(text);
            assert.equal(stripped, "fOoBaR bazqux");
        });

        it("should strip [CAPITALIZE] tag", function () {
            const text = "[CAPITALIZE]fOoBaR[/CAPITALIZE] bAzQuX";
            const stripped = strip(text);
            assert.equal(stripped, "FOoBaR bAzQuX");
        });

        it("should strip [CR] tag", function () {
            const text = "foo[CR]bar";
            const stripped = strip(text);
            assert.equal(stripped, "foo bar");
        });

        it("should strip [TABS] tag", function () {
            const text = "foo[TABS]13[/TABS]bar";
            const stripped = strip(text);
            assert.equal(stripped, "foo\t\t\t\t\t\t\t\t\t\t\t\t\tbar");
        });

        it("should strip two same tags", function () {
            const text = "[I]foo[/I][I]bar[/I]";
            const stripped = strip(text);
            assert.equal(stripped, "foobar");
        });

        it("should strip many tags", function () {
            const text = "[B]foo [COLOR blue]bar[/COLOR][CR][/B]";
            const stripped = strip(text);
            assert.equal(stripped, "foo bar");
        });

        it("should trim", function () {
            const text = " foo  ";
            const stripped = strip(text);
            assert.equal(stripped, "foo");
        });
    });
});
