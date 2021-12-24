/**
 * @module
 */

/* eslint-disable import/no-unassigned-import */
import "../polyfill/browser.js";
// Charger le menu avec l'écouteur browser.storage.onChanged avant que la
// configuration soit modifiée dans la migration.
import "./menu.js";
import "./migrate.js";
import "./permissions.js";
