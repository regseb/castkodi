/**
 * @license MIT
 * @see https://github.com/mozilla/addons-linter
 * @author Sébastien Règne
 */

export default {
    // Autoriser la propriété "service_worker" pour le "background".
    // https://github.com/mozilla/addons-linter/issues/5152
    enableBackgroundServiceWorker: true,
    // Autoriser la propriété "data_collection_permissions".
    // https://github.com/mozilla/addons-linter/issues/5845
    enableDataCollectionPermissions: true,
};
