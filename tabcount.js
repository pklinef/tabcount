function updateCount() {
  chrome.windows.getAll({ populate: true }, function (windows) {
    let count = 0;
    for (let wind of windows) {
      count += wind.tabs.length;
    }

    chrome.browserAction.setBadgeText({ text: count.toString() });
    chrome.browserAction.setTitle({ title: count + ' tabs' });
  });
}

chrome.tabs.onCreated.addListener(updateCount);
chrome.tabs.onRemoved.addListener(updateCount);
chrome.runtime.onInstalled.addListener(updateCount);