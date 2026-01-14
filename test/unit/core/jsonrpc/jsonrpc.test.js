/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import { JSONRPC } from "../../../../src/core/jsonrpc/jsonrpc.js";
import { Kodi } from "../../../../src/core/jsonrpc/kodi.js";
import "../../setup.js";

describe("core/jsonrpc/jsonrpc.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("ping()", () => {
        it("should ping", async () => {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () =>
                Promise.resolve("pong"),
            );

            const jsonrpc = new JSONRPC(kodi);
            const result = await jsonrpc.ping();
            assert.equal(result, "pong");

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, ["JSONRPC.Ping"]);
        });
    });

    describe("version()", () => {
        it("should return version", async () => {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () =>
                Promise.resolve({
                    version: { major: 1, minor: 2, patch: 3 },
                }),
            );

            const jsonrpc = new JSONRPC(kodi);
            const version = await jsonrpc.version();
            assert.deepEqual(version, { major: 1, minor: 2, patch: 3 });

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, ["JSONRPC.Version"]);
        });
    });
});
