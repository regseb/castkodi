/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { complete } from "../../../src/core/labelers.js";
import { extract } from "../../../src/core/scrapers.js";

/**
 * Appelle l'API de Twitch.
 *
 * @param {string} operationName Le nom de l'opération.
 * @param {Object} variables     Les paramètres de l'opération.
 * @param {string} sha256Hash    Le hash de l'opération.
 * @returns {Promise<Record<string, any>>} Une promesse contenant la réponse de
 *                                         l'API.
 */
const requestApi = async function (operationName, variables, sha256Hash) {
    const response = await fetch("https://gql.twitch.tv/gql", {
        headers: { "Client-Id": "kimne78kx3ncx6brgo4mv6wki5h1ko" },
        body: JSON.stringify([
            {
                operationName,
                variables,
                extensions: { persistedQuery: { version: 1, sha256Hash } },
            },
        ]),
        method: "POST",
    });
    const json = await response.json();
    return json[0];
};

describe("Labeler: Twitch", function () {
    it("should return channel label", async function () {
        const json = await requestApi(
            "BrowsePage_Popular",
            {
                limit: 1,
                platformType: "all",
                sortTypeIsRecency: false,
                includeIsDJ: true,
            },
            "75a4899f0a765cc08576125512f710e157b147897c06f96325de72d4c5a64890",
        );
        const node = json.data.streams.edges[0].node;

        const url = new URL(`https://www.twitch.tv/${node.broadcaster.login}`);
        const context = { depth: false, incognito: false };

        const file = /** @type {string} */ (await extract(url, context));
        const item = await complete({
            file,
            label: "",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file,
            label: node.broadcaster.displayName,
            position: 0,
            title: "",
            type: "unknown",
        });
    });

    it("should return default label when channel is offline", async function () {
        const url = new URL("https://www.twitch.tv/nolife");
        const context = { depth: false, incognito: false };

        const file = /** @type {string} */ (await extract(url, context));
        const item = await complete({
            file,
            label: "",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file,
            label: "Nolife",
            position: 0,
            title: "",
            type: "unknown",
        });
    });

    it("should return video label", async function () {
        const json = await requestApi(
            "FilterableVideoTower_Videos",
            {
                includePreviewBlur: false,
                limit: 1,
                channelOwnerLogin: "artefr",
                broadcastType: null,
                videoSort: "TIME",
            },
            "acea7539a293dfd30f0b0b81a263134bb5d9a7175592e14ac3f7c77b192de416",
        );
        const node = json.data.user.videos.edges[0].node;

        const url = new URL(`https://www.twitch.tv/videos/${node.id}`);
        const context = { depth: false, incognito: false };

        const file = /** @type {string} */ (await extract(url, context));
        const item = await complete({
            file,
            label: "",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file,
            label: node.title,
            position: 0,
            title: "",
            type: "unknown",
        });
    });

    it("should return clip label", async function () {
        const json = await requestApi(
            "ClipsCards__User",
            {
                login: "france_tv_slash",
                limit: 1,
                criteria: { filter: "ALL_TIME", isFeatured: false },
                cursor: null,
            },
            "4eb8f85fc41a36c481d809e8e99b2a32127fdb7647c336d27743ec4a88c4ea44",
        );
        const node = json.data.user.clips.edges[0].node;

        const url = new URL(node.url);
        const context = { depth: false, incognito: false };

        const file = /** @type {string} */ (await extract(url, context));
        const item = await complete({
            file,
            label: "",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file,
            label: node.title,
            position: 0,
            title: "",
            type: "unknown",
        });
    });

    it("should return embed clip label", async function () {
        const json = await requestApi(
            "ClipsCards__User",
            {
                login: "franceinfo",
                limit: 1,
                criteria: { filter: "ALL_TIME", isFeatured: false },
                cursor: null,
            },
            "4eb8f85fc41a36c481d809e8e99b2a32127fdb7647c336d27743ec4a88c4ea44",
        );
        const node = json.data.user.clips.edges[0].node;

        const url = new URL(node.embedURL);
        const context = { depth: false, incognito: false };

        const file = /** @type {string} */ (await extract(url, context));
        const item = await complete({
            file,
            label: "",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file,
            label: node.title,
            position: 0,
            title: "",
            type: "unknown",
        });
    });

    it("should return clip (from channel) label", async function () {
        const json = await requestApi(
            "ClipsCards__User",
            {
                login: "franceculture",
                limit: 1,
                criteria: { filter: "ALL_TIME", isFeatured: false },
                cursor: null,
            },
            "4eb8f85fc41a36c481d809e8e99b2a32127fdb7647c336d27743ec4a88c4ea44",
        );
        const node = json.data.user.clips.edges[0].node;

        const url = new URL(
            `https://www.twitch.tv/${node.broadcaster.login}/clip/${node.slug}`,
        );
        const context = { depth: false, incognito: false };

        const file = /** @type {string} */ (await extract(url, context));
        const item = await complete({
            file,
            label: "",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file,
            label: node.title,
            position: 0,
            title: "",
            type: "unknown",
        });
    });
});
