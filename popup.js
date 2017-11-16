chrome.windows.getAll({populate:true},function(windows){
  const openTabs = document.getElementsByTagName('tab-count')[0];
  const updatedOpenTabs = document.createDocumentFragment();

  const countDiv = updatedOpenTabs.appendChild(document.createElement('count'));
  updatedOpenTabs.appendChild(document.createTextNode('\n'));

  const exportBtn = updatedOpenTabs.appendChild(document.createElement('a'));
  updatedOpenTabs.appendChild(document.createTextNode('\n'));
  exportBtn.className = 'export';
  exportBtn.appendChild(document.createTextNode('Export'));

  var tabCount = 0;
  var windCount = 0;
  windows.forEach(function(wind){
    windCount++;
    tabCount += wind.tabs.length;
    updatedOpenTabs.appendChild(document.createTextNode('\n'));
    const windowEl = updatedOpenTabs.appendChild(document.createElement('window'));
    windowEl.appendChild(document.createTextNode('\n  '));
    const windowTitle = windowEl.appendChild(document.createElement('window-title'));
    windowEl.appendChild(document.createTextNode('\n  '));
    const windowId = wind.id;
    windowTitle.innerText = 'Window ' + windCount + ' (' + wind.tabs.length + ' tabs)';    

    wind.tabs.forEach(function(tab){
      const tabEl = windowEl.appendChild(document.createElement('tab'));
      windowEl.appendChild(document.createTextNode('\n  '));
      tabEl.appendChild(document.createTextNode('\n    '));
      const a = tabEl.appendChild(document.createElement('a'));
      tabEl.appendChild(document.createTextNode('\n  '));
      a.appendChild(document.createTextNode('\n    '));

      const icon = document.createElement('img');
      icon.className = 'icon';

      if (tab.favIconUrl) {
        icon.src = tab.favIconUrl;
      } else {
        icon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
      }
      
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

  exportBtn.addEventListener('click', function (e) {
    const html = document.body.parentElement.cloneNode(true);

    var script = html.getElementsByTagName('script')[0];
    script.remove();

    var saveBtn = html.getElementsByClassName('export')[0];
    saveBtn.remove();

    exportBtn.setAttribute('download', 'tabs.html');
    exportBtn.setAttribute('href', 'data:text/html;charset=utf-8,' + 
      encodeURIComponent(html.outerHTML));
    return false;
  });

  openTabs.appendChild(updatedOpenTabs);
});