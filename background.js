// Chrome automatically creates a background.html page for this to execute.
// This can access the inspected page via executeScript
//
// Can use:
// chrome.tabs.*
// chrome.extension.*

// Standard Google Universal Analytics code

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); // Note: https protocol here

ga('create', 'UA-98927264-1', 'auto');
ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
ga('require', 'displayfeatures');


chrome.extension.onConnect.addListener(function (port) {

    var extensionListener = function (message, sender, sendResponse) {

        if(message.tabId && message.action && message.content) {

          if (message.action === 'track-pageview') {
            ga('send', 'pageview', message.content);
          }

        // This accepts messages from the inspectedPage and
        // sends them to the panel
        } else {
            port.postMessage(message);
        }
        sendResponse(message);
    }

    // Listens to messages sent from the panel
    chrome.extension.onMessage.addListener(extensionListener);

    port.onDisconnect.addListener(function(port) {
        chrome.extension.onMessage.removeListener(extensionListener);
    });

    // port.onMessage.addListener(function (message) {
    //     port.postMessage(message);
    // });

});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    return true;
});
