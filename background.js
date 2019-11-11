chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.active) {
        /*
        chrome.tabs.getSelected(null,function(tab) {
            var tablink = tab.url;
            var a = document.createElement ('a');
            a.href = tablink;
            alert(a.hostname);
            if (a.hostname == "") {
                document.getElementById("website_id").value = "";
            }
        });*/
    }
})