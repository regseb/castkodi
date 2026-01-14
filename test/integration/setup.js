/**
 * @license MIT
 * @author Sébastien Règne
 */

import { kodi } from "../../src/core/jsonrpc/kodi.js";
import "../polyfill/index.js";

kodi.addons.getAddons = () => Promise.resolve([]);
