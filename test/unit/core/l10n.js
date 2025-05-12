/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
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
    describe("locate()", function () {
        it("should do nothing when there isn't data-l10n-*", function () {
            const doc = new DOMParser().parseFromString(
                "<html><body></body></html>",
                "text/html",
            );
            locate(doc, "foo");
            const body = /** @type {HTMLBodyElement} */ (
                doc.querySelector("body")
            );
            assert.equal(body.innerHTML.trim(), "");
        });

        it("should insert message in attribut", function () {
            const stub = sinon.stub(browser.i18n, "getMessage").returns("foo");

            const doc = new DOMParser().parseFromString(
                `<html><body>
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

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["baz_bar_title"]);
        });

        it("should insert message in text content", function () {
            const stub = sinon.stub(browser.i18n, "getMessage").returns("foo");

            const doc = new DOMParser().parseFromString(
                `<html><body>
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

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["baz_bar_textcontent"]);
        });

        it("should insert message in specific position", function () {
            const stub = sinon.stub(browser.i18n, "getMessage").returns("foo");

            const doc = new DOMParser().parseFromString(
                `<html><body>
                   <p data-l10n-textcontent="bar"><img> {}</p>
                 </body></html>`,
                "text/html",
            );
            locate(doc, "quux");
            const p = /** @type {HTMLParagraphElement} */ (
                doc.querySelector("p")
            );
            assert.equal(p.innerHTML.trim(), "<img> foo");
            assert.deepEqual(objectifyAttributes(p.attributes), {
                "data-l10n-textcontent": "bar",
            });

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["quux_bar_textcontent"]);
        });

        it("should use id", function () {
            const stub = sinon.stub(browser.i18n, "getMessage").returns("foo");

            const doc = new DOMParser().parseFromString(
                `<html><body>
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

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["baz_bar_title"]);
        });

        it("should use name", function () {
            const stub = sinon.stub(browser.i18n, "getMessage").returns("foo");

            const doc = new DOMParser().parseFromString(
                `<html><body>
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

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["baz_bar_placeholder"]);
        });

        it("should use value", function () {
            const stub = sinon.stub(browser.i18n, "getMessage").returns("foo");

            const doc = new DOMParser().parseFromString(
                `<html><body>
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

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["baz_bar_textcontent"]);
        });

        it("should convert beer-case to PascalCase", function () {
            const stub = sinon.stub(browser.i18n, "getMessage").returns("foo");

            const doc = new DOMParser().parseFromString(
                `<html><body>
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

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "quux_barBazQux_textcontent",
            ]);
        });

        it("should reject if no value", function () {
            const stub = sinon.stub(browser.i18n, "getMessage").returns("foo");

            const doc = new DOMParser().parseFromString(
                `<html><body>
                   <button data-l10n-title></button>
                 </body></html>`,
                "text/html",
            );
            assert.throws(() => locate(doc, "baz"), {
                name: "Error",
                message: "[data-l10n-*] without value",
            });

            assert.equal(stub.callCount, 0);
        });

        it("should insert in template", function () {
            const stub = sinon.stub(browser.i18n, "getMessage").returns("foo");

            const doc = new DOMParser().parseFromString(
                `<html><body>
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

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["qux_baz_title"]);
        });
    });
});
