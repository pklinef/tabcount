/* global chrome, Blob, URL, document, window */

chrome.windows.getAll({populate:true},function(windows){
  const openTabs = document.getElementsByTagName('tab-count')[0];
  const updatedOpenTabs = document.createDocumentFragment();

  const countDiv = updatedOpenTabs.appendChild(document.createElement('count'));
  updatedOpenTabs.appendChild(document.createTextNode('\n'));

  const exportBtn = updatedOpenTabs.appendChild(document.createElement('a'));
  updatedOpenTabs.appendChild(document.createTextNode('\n'));
  exportBtn.className = 'export';
  exportBtn.appendChild(document.createTextNode('Export to file'));

  let tabCount = 0;
  let windCount = 0;
  windows.forEach(function(wind){
    windCount++;
    tabCount += wind.tabs.length;
    updatedOpenTabs.appendChild(document.createTextNode('\n'));
    const windowEl = updatedOpenTabs.appendChild(document.createElement('window'));
    windowEl.appendChild(document.createTextNode('\n  '));
    const windowTitle = windowEl.appendChild(document.createElement('window-title'));
    windowEl.appendChild(document.createTextNode('\n  '));
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
      a.addEventListener('click', function (event) {
        chrome.windows.update(wind.id, {focused: true});
        chrome.tabs.highlight({windowId: wind.id, tabs: tab.index});
        return false;
      });   
    });
  });

  countDiv.innerText = tabCount + ' tabs';
  if (windows.length > 1) {
    countDiv.innerText = countDiv.innerText + ' from ' + windows.length + ' windows';
  }

  exportBtn.addEventListener('click', function (event) {
    const html = document.body.parentElement.cloneNode(true);

    const script = html.getElementsByTagName('script')[0];
    script.remove();

    const saveBtn = html.getElementsByClassName('export')[0];
    saveBtn.remove();

    const exportDate = new Date().toISOString().slice(0, 10);

    const filename = 'tab-export-' + exportDate + '.html';

    const encoder = new TextEncoder();
    const htmlBytes = encoder.encode(html.outerHTML);

    const url = URL.createObjectURL(new Blob([htmlBytes], { type: 'text/html' }));

    exportBtn.setAttribute('download', filename);
    exportBtn.setAttribute('href', url);

    return false;
  });

  openTabs.appendChild(updatedOpenTabs);
});