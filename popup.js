chrome.windows.getAll({populate:true},function(windows){
  const openTabs = document.getElementsByTagName('tab-count')[0];
  const updatedOpenTabs = openTabs.cloneNode();

  const countDiv = updatedOpenTabs.appendChild(document.createElement('count'));

  var tabCount = 0;
  var windCount = 0;
  windows.forEach(function(wind){
    windCount++;
    tabCount += wind.tabs.length;
    const windowEl = updatedOpenTabs.appendChild(document.createElement('window'));
    const windowTitle = windowEl.appendChild(document.createElement('window-title'));
    const windowId = wind.id;
    windowTitle.innerText = 'Window ' + windCount + ' (' + wind.tabs.length + ' tabs)';

    wind.tabs.forEach(function(tab){
      const tabEl = windowEl.appendChild(document.createElement('tab'));
      const a = tabEl.appendChild(document.createElement('a'));

      const icon = document.createElement('img');
      icon.className = 'icon';
      icon.src = 'chrome://favicon/size/128@3.0x/' + tab.url;
      a.appendChild(icon);

      a.href = tab.url;
      a.title = tab.title;
      a.appendChild(document.createTextNode(tab.title));
      a.addEventListener('click', function (e) {
        chrome.windows.update(wind.id, {focused: true});
        chrome.tabs.highlight({windowId: wind.id, tabs: tab.index});
        return false;
      });   
    });
  });
  
  countDiv.innerText = tabCount + ' tabs across ' + windows.length + ' windows';

  openTabs.parentNode.replaceChild(updatedOpenTabs, openTabs);
});