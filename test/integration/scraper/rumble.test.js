/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("Scraper: Rumble", () => {
    afterEach(() => {
        mock.reset();
    });

    it("should return video URL", async () => {
        // Modifier la fonction fetch() pour transmettre les cookies lors des
        // redirections (comme le font les navigateurs). Rumble fait une
        // redirection sur la même page et y ajoute des cookies. Sans la
        // transmission des cookies, fetch() suit les redirections indéfiniment.
        const nativeFetch = globalThis.fetch;
        mock.method(globalThis, "fetch", async (url, options = {}) => {
            const response = await nativeFetch(url, {
                ...options,
                redirect: "manual",
            });

            if (![301, 302, 303, 307, 208].includes(response.status)) {
                return response;
            }

            return await nativeFetch(
                new URL(response.headers.get("Location"), url),
                {
                    ...options,
                    headers: {
                        ...options.headers,
                        cookie: response.headers
                            .getSetCookie()
                            .map((c) => c.slice(0, c.indexOf(";")))
                            .join("; "),
                    },
                },
            );
        });

        const url = new URL(
            "https://rumble.com/v1k2hrq-nasa-gets-set-to-crash-spacecraft" +
                "-into-asteroid.html",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://1a-1791.com/video/s8/2/2/5/p/N/25pNf.haa.mp4",
        );
    });

    it("should return video URL from embed", async () => {
        const url = new URL("https://rumble.com/embed/v1gga0u/?pub=4");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://1a-1791.com/video/s8/2/-/p/1/G/-p1Gf.haa.mp4",
        );
    });
});
