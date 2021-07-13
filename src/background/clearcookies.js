const removeCookies = function (details) {
  for (let i = 0; i < details.requestHeaders.length; i++) {
    const header = details.requestHeaders[i];
    if ("cookie" === header.name.toLowerCase()) {
      details.requestHeaders.splice(i, 1);
    }
  }
  return { requestHeaders: details.requestHeaders };
};

browser.webRequest.onBeforeSendHeaders.addListener(
  removeCookies,
  { urls: ["ws://*/jsonrpc", "ws://*/jsonrpc?*"] },
  ["blocking", "requestHeaders"],
);
