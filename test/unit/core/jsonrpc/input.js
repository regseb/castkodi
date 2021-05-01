import assert from "node:assert";
import sinon from "sinon";
import { Input } from "../../../../src/core/jsonrpc/input.js";

describe("core/jsonrpc/input.js", function () {
    describe("back()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");

            const input = new Input({ send: fake });
            const result = await input.back();
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, ["Input.Back"]);
        });
    });

    describe("contextMenu()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");

            const input = new Input({ send: fake });
            const result = await input.contextMenu();
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, ["Input.ContextMenu"]);
        });
    });

    describe("down()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");

            const input = new Input({ send: fake });
            const result = await input.down();
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, ["Input.Down"]);
        });
    });

    describe("home()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");

            const input = new Input({ send: fake });
            const result = await input.home();
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, ["Input.Home"]);
        });
    });

    describe("info()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");

            const input = new Input({ send: fake });
            const result = await input.info();
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, ["Input.Info"]);
        });
    });

    describe("left()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");

            const input = new Input({ send: fake });
            const result = await input.left();
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, ["Input.Left"]);
        });
    });

    describe("right()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");

            const input = new Input({ send: fake });
            const result = await input.right();
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, ["Input.Right"]);
        });
    });

    describe("select()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");

            const input = new Input({ send: fake });
            const result = await input.select();
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, ["Input.Select"]);
        });
    });

    describe("sendText()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");

            const input = new Input({ send: fake });
            const result = await input.sendText("foo", false);
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Input.SendText",
                { text: "foo", done: false },
            ]);
        });

        it("should send request and finish", async function () {
            const fake = sinon.fake.resolves("OK");

            const input = new Input({ send: fake });
            const result = await input.sendText("foo", true);
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Input.SendText",
                { text: "foo", done: true },
            ]);
        });
    });

    describe("showOSD()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");

            const input = new Input({ send: fake });
            const result = await input.showOSD();
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, ["Input.ShowOSD"]);
        });
    });

    describe("showPlayerProcessInfo()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");

            const input = new Input({ send: fake });
            const result = await input.showPlayerProcessInfo();
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Input.ShowPlayerProcessInfo",
            ]);
        });
    });

    describe("up()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");

            const input = new Input({ send: fake });
            const result = await input.up();
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, ["Input.Up"]);
        });
    });

    describe("handleNotification()", function () {
        it("should ignore others namespaces", function (done) {
            const input = new Input({ send: Function.prototype });
            input.onInputRequested.addListener(assert.fail);
            input.handleNotification({
                method: "Other.OnInputRequested",
                params: { data: "foo" },
            });
            done();
        });

        it("should ignore when no listener", async function () {
            const fake = sinon.fake.rejects(new Error("bar"));

            const input = new Input({ send: fake });
            await input.handleNotification({
                method: "Input.OnInputRequested",
                params: { data: "foo" },
            });

            assert.strictEqual(fake.callCount, 0);
        });

        it("should handle 'OnInputRequested'", function (done) {
            const input = new Input({ send: Function.prototype });
            input.onInputRequested.addListener((data) => {
                assert.deepStrictEqual(data, { foo: "bar" });
                done();
            });
            input.handleNotification({
                method: "Input.OnInputRequested",
                params: { data: { foo: "bar" } },
            });
            assert.fail();
        });

        it("should ignore others notifications", function (done) {
            const input = new Input({ send: Function.prototype });
            input.onInputRequested.addListener(assert.fail);
            input.handleNotification({
                method: "Input.Other",
                params: { data: "foo" },
            });
            done();
        });
    });
});
