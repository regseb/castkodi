/**
 * @license MIT
 * @author Sébastien Règne
 */

import { kodi } from "../../src/core/jsonrpc/kodi.js";
import "../polyfill/index.js";

globalThis.fetch = () => Promise.resolve(new Response());
kodi.addons.getAddons = () => Promise.resolve([]);
