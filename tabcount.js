function updateCount() {
  chrome.windows.getAll({ populate: true }, function (windows) {
    let count = 0;
    for (let wind of windows) {
      count += wind.tabs.length;
    }

    let badgeText = count.toString();
    if (count >= 1000) {
      badgeText = (count / 1000).toFixed(0).toString() + "k";
    }

    chrome.browserAction.setBadgeText({ text: badgeText });
    chrome.browserAction.setTitle({ title: count + ' tabs' });
  });
}

chrome.tabs.onCreated.addListener(updateCount);
chrome.tabs.onRemoved.addListener(updateCount);
chrome.runtime.onInstalled.addListener(updateCount);