/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import { locate } from "../../../src/core/l10n.js";

/**
 * Convertit une liste d'attributs en objet.
 *
 * @param {NamedNodeMap} attributes La liste des attributs.
 * @returns {Object<string, string>} L'objet contenant les attributs.
 */
const objectifyAttributes = (attributes) => {
    return Object.fromEntries(Array.from(attributes, (a) => [a.name, a.value]));
};

describe("core/l10n.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("locate()", function () {
        it("should do nothing when there isn't data-l10n-*", function () {
            const doc = new DOMParser().parseFromString(
                '<html lang="en"><body></body></html>',
                "text/html",
            );
            locate(doc, "foo");
            const body = /** @type {HTMLBodyElement} */ (
                doc.querySelector("body")
            );
            assert.equal(body.innerHTML.trim(), "");
        });

        it("should insert message in attribut", function () {
            const getMessage = mock.method(
                browser.i18n,
                "getMessage",
                () => "foo",
            );

            const doc = new DOMParser().parseFromString(
                `<html lang="en"><body>
                   <p data-l10n-title="bar"></p>
                 </body></html>`,
                "text/html",
            );
            locate(doc, "baz");
            const p = /** @type {HTMLParagraphElement} */ (
                doc.querySelector("p")
            );
            assert.equal(p.innerHTML.trim(), "");
            assert.deepEqual(objectifyAttributes(p.attributes), {
                "data-l10n-title": "bar",
                title: "foo",
            });

            assert.equal(getMessage.mock.callCount(), 1);
            assert.deepEqual(getMessage.mock.calls[0].arguments, [
                "baz_bar_title",
            ]);
        });

        it("should insert message in text content", function () {
            const getMessage = mock.method(
                browser.i18n,
                "getMessage",
                () => "foo",
            );

            const doc = new DOMParser().parseFromString(
                `<html lang="en"><body>
                   <p data-l10n-textcontent="bar"></p>
                 </body></html>`,
                "text/html",
            );
            locate(doc, "baz");
            const p = /** @type {HTMLParagraphElement} */ (
                doc.querySelector("p")
            );
            assert.equal(p.innerHTML.trim(), "foo");
            assert.deepEqual(objectifyAttributes(p.attributes), {
                "data-l10n-textcontent": "bar",
            });

            assert.equal(getMessage.mock.callCount(), 1);
            assert.deepEqual(getMessage.mock.calls[0].arguments, [
                "baz_bar_textcontent",
            ]);
        });

        it("should insert message in specific position", function () {
            const getMessage = mock.method(
                browser.i18n,
                "getMessage",
                () => "foo",
            );

            const doc = new DOMParser().parseFromString(
                `<html lang="en"><body>
                   <p data-l10n-textcontent="bar"><img alt=""> {}</p>
                 </body></html>`,
                "text/html",
            );
            locate(doc, "quux");
            const p = /** @type {HTMLParagraphElement} */ (
                doc.querySelector("p")
            );
            assert.equal(p.innerHTML.trim(), '<img alt=""> foo');
            assert.deepEqual(objectifyAttributes(p.attributes), {
                "data-l10n-textcontent": "bar",
            });

            assert.equal(getMessage.mock.callCount(), 1);
            assert.deepEqual(getMessage.mock.calls[0].arguments, [
                "quux_bar_textcontent",
            ]);
        });

        it("should use id", function () {
            const getMessage = mock.method(
                browser.i18n,
                "getMessage",
                () => "foo",
            );

            const doc = new DOMParser().parseFromString(
                `<html lang="en"><body>
                   <p id="bar" data-l10n-title></p>
                 </body></html>`,
                "text/html",
            );
            locate(doc, "baz");
            const p = /** @type {HTMLParagraphElement} */ (
                doc.querySelector("p")
            );
            assert.equal(p.innerHTML.trim(), "");
            assert.deepEqual(objectifyAttributes(p.attributes), {
                id: "bar",
                "data-l10n-title": "",
                title: "foo",
            });

            assert.equal(getMessage.mock.callCount(), 1);
            assert.deepEqual(getMessage.mock.calls[0].arguments, [
                "baz_bar_title",
            ]);
        });

        it("should use name", function () {
            const getMessage = mock.method(
                browser.i18n,
                "getMessage",
                () => "foo",
            );

            const doc = new DOMParser().parseFromString(
                `<html lang="en"><body>
                   <input name="bar" data-l10n-placeholder />
                 </body></html>`,
                "text/html",
            );
            locate(doc, "baz");
            const input = /** @type {HTMLInputElement} */ (
                doc.querySelector("input")
            );
            assert.equal(input.innerHTML.trim(), "");
            assert.deepEqual(objectifyAttributes(input.attributes), {
                name: "bar",
                "data-l10n-placeholder": "",
                placeholder: "foo",
            });

            assert.equal(getMessage.mock.callCount(), 1);
            assert.deepEqual(getMessage.mock.calls[0].arguments, [
                "baz_bar_placeholder",
            ]);
        });

        it("should use value", function () {
            const getMessage = mock.method(
                browser.i18n,
                "getMessage",
                () => "foo",
            );

            const doc = new DOMParser().parseFromString(
                `<html lang="en"><body>
                   <button value="bar" data-l10n-textcontent></button>
                 </body></html>`,
                "text/html",
            );
            locate(doc, "baz");
            const button = /** @type {HTMLButtonElement} */ (
                doc.querySelector("button")
            );
            assert.equal(button.innerHTML.trim(), "foo");
            assert.deepEqual(objectifyAttributes(button.attributes), {
                value: "bar",
                "data-l10n-textcontent": "",
            });

            assert.equal(getMessage.mock.callCount(), 1);
            assert.deepEqual(getMessage.mock.calls[0].arguments, [
                "baz_bar_textcontent",
            ]);
        });

        it("should convert beer-case to PascalCase", function () {
            const getMessage = mock.method(
                browser.i18n,
                "getMessage",
                () => "foo",
            );

            const doc = new DOMParser().parseFromString(
                `<html lang="en"><body>
                   <span data-l10n-textcontent="bar-baz-qux"></span>
                 </body></html>`,
                "text/html",
            );
            locate(doc, "quux");
            const span = /** @type {HTMLSpanElement} */ (
                doc.querySelector("span")
            );
            assert.equal(span.innerHTML.trim(), "foo");
            assert.deepEqual(objectifyAttributes(span.attributes), {
                "data-l10n-textcontent": "bar-baz-qux",
            });

            assert.equal(getMessage.mock.callCount(), 1);
            assert.deepEqual(getMessage.mock.calls[0].arguments, [
                "quux_barBazQux_textcontent",
            ]);
        });

        it("should reject if no value", function () {
            const getMessage = mock.method(browser.i18n, "getMessage");

            const doc = new DOMParser().parseFromString(
                `<html lang="en"><body>
                   <button data-l10n-title></button>
                 </body></html>`,
                "text/html",
            );
            assert.throws(() => locate(doc, "baz"), {
                name: "Error",
                message: "[data-l10n-*] without value",
            });

            assert.equal(getMessage.mock.callCount(), 0);
        });

        it("should insert in template", function () {
            const getMessage = mock.method(
                browser.i18n,
                "getMessage",
                () => "foo",
            );

            const doc = new DOMParser().parseFromString(
                `<html lang="en"><body>
                   <template>
                     <p class="bar" data-l10n-title="baz"></p>
                   </template>
                 </body></html>`,
                "text/html",
            );
            locate(doc, "qux");
            const template = /** @type {HTMLTemplateElement} */ (
                doc.querySelector("template")
            );
            const p = /** @type {HTMLParagraphElement} */ (
                template.content.querySelector("p")
            );
            assert.equal(p.innerHTML.trim(), "");
            assert.deepEqual(objectifyAttributes(p.attributes), {
                class: "bar",
                "data-l10n-title": "baz",
                title: "foo",
            });

            assert.equal(getMessage.mock.callCount(), 1);
            assert.deepEqual(getMessage.mock.calls[0].arguments, [
                "qux_baz_title",
            ]);
        });
    });
});
