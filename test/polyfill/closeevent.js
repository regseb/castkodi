/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @type {CloseEvent}
 * @see https://developer.mozilla.org/Web/API/CloseEvent
 * @see https://github.com/thoov/mock-socket/issues/380
 * @see https://github.com/nodejs/node/issues/46880
 */
export const CloseEvent = class extends Event {};
