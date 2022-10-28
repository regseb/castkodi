import assert from "node:assert/strict";
import { quote, strip } from "../../../../src/core/tools/sanitizer.js";

describe("core/sanitizer.js", function () {
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
            const text = "Normal [B]bold[/B]";
            const stripped = strip(text);
            assert.equal(stripped, "Normal bold");
        });

        it("should strip [I] tag", function () {
            const text = "[I]Italic[/I] normal";
            const stripped = strip(text);
            assert.equal(stripped, "Italic normal");
        });

        it("should strip [LIGHT] tag", function () {
            const text = "[LIGHT]LIGHT[/LIGHT]";
            const stripped = strip(text);
            assert.equal(stripped, "LIGHT");
        });

        it("should strip [COLOR] tag", function () {
            const text = "Black [COLOR red]red[/COLOR]";
            const stripped = strip(text);
            assert.equal(stripped, "Black red");
        });

        it("should strip [UPPERCASE] tag", function () {
            const text = "[UPPERCASE]Uppercase[/UPPERCASE] lowercase";
            const stripped = strip(text);
            assert.equal(stripped, "Uppercase lowercase");
        });

        it("should strip [LOWERCASE] tag", function () {
            const text = "Uppercase [LOWERCASE]lowercase[/LOWERCASE]";
            const stripped = strip(text);
            assert.equal(stripped, "Uppercase lowercase");
        });

        it("should strip [CAPITALIZE] tag", function () {
            const text = "[CAPITALIZE]Capitalize[/CAPITALIZE] communize";
            const stripped = strip(text);
            assert.equal(stripped, "Capitalize communize");
        });

        it("should strip [CR] tag", function () {
            const text = "Line one[CR]Line two";
            const stripped = strip(text);
            assert.equal(stripped, "Line one Line two");
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
