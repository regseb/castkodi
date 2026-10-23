/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { once } from "node:events";
import { describe, it, mock } from "node:test";
import timers from "node:timers/promises";
import { setupServer } from "msw/node";
import { ws } from "msw/ws";
import { JSONRPC } from "../../../../src/core/tools/jsonrpc.js";
import "../../setup.js";

/**
 * @import { WebSocketHandlerEventMap } from "msw/ws"
 */

// Désactiver cette règle, car la syntaxe `[Symbol.dispose](): void` n'est pas
// supportée. https://github.com/gajus/eslint-plugin-jsdoc/issues/1822
/* eslint-disable jsdoc/valid-types */
/**
 * Crée un serveur WebSocket simulé.
 *
 * @param {(connection: WebSocketHandlerEventMap["connection"]) => void} listener Auditeur
 *                                                                                pour
 *                                                                                la
 *                                                                                connexion
 *                                                                                d'un
 *                                                                                client.
 * @returns {{ url: URL, close(): void, [Symbol.dispose](): void }} Serveur
 *                                                                  WebSocket
 *                                                                  simulé.
 */
const mockWebSocketServer = (listener) => {
    const url = new URL("ws://localhost/");
    const server = setupServer(
        ws.link(url.href).addEventListener("connection", listener),
    );
    server.listen();

    return {
        get url() {
            return url;
        },

        close() {
            server.close();
        },

        // https://github.com/mswjs/msw/issues/2798
        [Symbol.dispose]() {
            this.close();
        },
    };
};
/* eslint-enable jsdoc/valid-types */

describe("core/tools/jsonrpc.js", () => {
    describe("open()", () => {
        it("should return promise fulfilled", async () => {
            using server = mockWebSocketServer(({ client }) => {
                assert.deepEqual(client.url, server.url);
            });

            const jsonrpc = await JSONRPC.open(server.url);
            assert.equal(typeof jsonrpc, "object");
        });

        it("should return promise rejected", async () => {
            // Ne pas instancier de serveur pour faire échouer la connexion.
            await assert.rejects(
                () => JSONRPC.open(new URL("ws://localhost/")),
                {
                    name: "Error",
                    message:
                        "Connection to the server at ws://localhost/" +
                        " unestablished",
                },
            );
        });
    });

    describe("close()", () => {
        it("should close connection", async () => {
            const listener = mock.fn();
            using server = mockWebSocketServer(({ client }) => {
                client.addEventListener("close", listener);
            });

            const jsonrpc = await JSONRPC.open(server.url);
            jsonrpc.close();

            // Attendre le prochain cycle pour que l'événement du "close" soit
            // déclenché.
            await timers.setImmediate();

            assert.equal(listener.mock.callCount(), 1);
            const event = listener.mock.calls[0].arguments[0];
            assert.equal(event.code, 1000);
            assert.equal(event.reason, "");
            assert.equal(event.wasClean, true);
        });

        it("should close connection with code", async () => {
            const listener = mock.fn();
            using server = mockWebSocketServer(({ client }) => {
                client.addEventListener("close", listener);
            });

            const jsonrpc = await JSONRPC.open(server.url);
            jsonrpc.close(4000);

            // Attendre le prochain cycle pour que l'événement du "close" soit
            // déclenché.
            await timers.setImmediate();

            assert.equal(listener.mock.callCount(), 1);
            const event = listener.mock.calls[0].arguments[0];
            assert.equal(event.code, 4000);
            assert.equal(event.reason, "");
            assert.equal(event.wasClean, true);
        });

        it("should close connection with code and reason", async () => {
            const listener = mock.fn();
            using server = mockWebSocketServer(({ client }) => {
                client.addEventListener("close", listener);
            });

            const jsonrpc = await JSONRPC.open(server.url);
            jsonrpc.close(4242, "foo");

            // Attendre le prochain cycle pour que l'événement du "close" soit
            // déclenché.
            await timers.setImmediate();

            assert.equal(listener.mock.callCount(), 1);
            const event = listener.mock.calls[0].arguments[0];
            assert.equal(event.code, 4242);
            assert.equal(event.reason, "foo");
            assert.equal(event.wasClean, true);
        });
    });

    describe("send()", () => {
        it("should send message", async () => {
            using server = mockWebSocketServer(({ client }) => {
                client.addEventListener("message", (event) => {
                    const request = JSON.parse(event.data.toString());
                    assert.deepEqual(request, {
                        jsonrpc: "2.0",
                        method: "foo",
                        params: { bar: "baz" },
                        id: 1,
                    });

                    client.send(
                        JSON.stringify({
                            jsonrpc: "2.0",
                            result: "qux",
                            id: request.id,
                        }),
                    );
                });
            });

            const jsonrpc = await JSONRPC.open(server.url);
            const result = await jsonrpc.send("foo", { bar: "baz" });
            assert.equal(result, "qux");
        });

        it("should send message without params", async () => {
            using server = mockWebSocketServer(({ client }) => {
                client.addEventListener("message", (event) => {
                    const request = JSON.parse(event.data.toString());
                    assert.deepEqual(request, {
                        jsonrpc: "2.0",
                        method: "foo",
                        id: 1,
                    });

                    client.send(
                        JSON.stringify({
                            jsonrpc: "2.0",
                            result: { bar: "baz" },
                            id: request.id,
                        }),
                    );
                });
            });

            const jsonrpc = await JSONRPC.open(server.url);
            const result = await jsonrpc.send("foo");
            assert.deepEqual(result, { bar: "baz" });
        });

        it("should dispatch error message", async () => {
            using server = mockWebSocketServer(({ client }) => {
                client.addEventListener("message", (event) => {
                    const request = JSON.parse(event.data.toString());
                    client.send(
                        JSON.stringify({
                            jsonrpc: "2.0",
                            error: { code: 42, message: "bar" },
                            id: request.id,
                        }),
                    );
                });
            });

            const jsonrpc = await JSONRPC.open(server.url);
            await assert.rejects(() => jsonrpc.send("foo"), {
                name: "Error",
                message: "bar",
            });
        });

        it("should dispatch result", async () => {
            using server = mockWebSocketServer(({ client }) => {
                client.addEventListener("message", (event) => {
                    const request = JSON.parse(event.data.toString());
                    switch (request.id) {
                        case 1:
                            client.send(
                                JSON.stringify({
                                    jsonrpc: "2.0",
                                    result: "baz",
                                    id: request.id,
                                }),
                            );
                            break;
                        case 2:
                            client.send(
                                JSON.stringify({
                                    jsonrpc: "2.0",
                                    result: { qux: "quux" },
                                    id: request.id,
                                }),
                            );
                            break;
                        default:
                            client.send(
                                JSON.stringify({
                                    jsonrpc: "2.0",
                                    error: { message: request.id },
                                    id: request.id,
                                }),
                            );
                    }
                });
            });

            const jsonrpc = await JSONRPC.open(server.url);
            let result = await jsonrpc.send("foo");
            assert.equal(result, "baz");
            result = await jsonrpc.send("bar");
            assert.deepEqual(result, { qux: "quux" });
        });
    });

    describe("addEventListener()", () => {
        it("should dispatch close event", async () => {
            using server = mockWebSocketServer(async ({ client }) => {
                // Attendre le prochain cycle pour laisser le temps au client
                // d'ajouter son auditeur.
                await timers.setImmediate();
                client.close();
            });

            const jsonrpc = await JSONRPC.open(server.url);
            const [event] = await once(jsonrpc, "close");

            assert.equal(event.type, "close");
        });

        it("should dispatch notification event", async () => {
            using server = mockWebSocketServer(async ({ client }) => {
                // Attendre le prochain cycle pour laisser le temps au client
                // d'ajouter son auditeur.
                await timers.setImmediate();
                client.send(
                    JSON.stringify({
                        jsonrpc: "2.0",
                        method: "foo",
                        params: { bar: "baz" },
                    }),
                );
            });

            const jsonrpc = await JSONRPC.open(server.url);
            const [event] = await once(jsonrpc, "notification");

            assert.equal(event.type, "notification");
            assert.equal(event.method, "foo");
            assert.deepEqual(event.params, { bar: "baz" });
        });
    });
});
