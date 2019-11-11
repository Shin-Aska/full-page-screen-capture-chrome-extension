// Copyright (c) 2012,2013 Peter Coles - http://mrcoles.com/ - All rights reserved.
// Use of this source code is governed by the MIT License found in LICENSE


//
// State fields
//

var currentTab, // result of chrome.tabs.query of current active tab
    resultWindowId; // window id for putting resulting images


//
// Utility methods
//

Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    var week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                            - 3 + (week1.getDay() + 6) % 7) / 7);
}
  
Date.prototype.getWeekYear = function() {
    var date = new Date(this.getTime());
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    return date.getFullYear();
}


function $(id) { return document.getElementById(id); }
function show(id) { $(id).style.display = 'block'; }
function hide(id) { $(id).style.display = 'none'; }


function getFilename(contentURL) {
    var name = contentURL.split('?')[0].split('#')[0];
    if (name) {
        name = name
            .replace(/^https?:\/\//, '')
            .replace(/[^A-z0-9]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^[_\-]+/, '')
            .replace(/[_\-]+$/, '');
        name = '-' + name;
    } else {
        name = '';
    }
    return 'screencapture' + name + '-' + Date.now() + '.png';
}


//
// Capture Handlers
//


function displayCaptures(filenames) {
    if (!filenames || !filenames.length) {
        show('uh-oh');
        return;
    }

    _displayCapture(filenames);
}


function _displayCapture(filenames, index) {
    index = index || 0;

    var filename = filenames[index];
    var last = index === filenames.length - 1;
    if (currentTab.incognito && index === 0) {
        // cannot access file system in incognito, so open in non-incognito
        // window and add any additional tabs to that window.
        //
        // we have to be careful with focused too, because that will close
        // the popup.
        /*chrome.windows.create({
            url: filename,
            incognito: false,
            focused: last
        }, function(win) {
            resultWindowId = win.id;
        });*/

        var blob = window.lastBlob[0];
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                alert(this.responseText);
            }
        };
        xhttp.onload = function (oEvent) {
            // Uploaded.
        };
        xhttp.open("POST", "http://40.118.0.105:7777?week=" + document.getElementById("week_no").value + "&website_id=" + document.getElementById("website_id").value + "&product_id=" + document.getElementById("product_id").value + "&url=" + document.getElementById("url").value, true);
        xhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
        xhttp.send(blob);
    } else {

        /*chrome.tabs.create({
            url: filename,
            active: last,
            windowId: resultWindowId,
            openerTabId: currentTab.id,
            index: (currentTab.incognito ? 0 : currentTab.index) + 1 + index
        });*/

        var blob = window.lastBlob[0];
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                alert(this.responseText);
            }
        };
        xhttp.onload = function (oEvent) {
            // Uploaded.
        };
        xhttp.open("POST", "http://40.118.0.105:7777?week=" + document.getElementById("week_no").value + "&website_id=" + document.getElementById("website_id").value + "&product_id=" + document.getElementById("product_id").value + "&url=" + document.getElementById("url").value, true);
        xhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
        xhttp.send(blob);
    }

    if (!last) {
        _displayCapture(filenames, index + 1);
    }
}


function errorHandler(reason) {
    show('uh-oh'); // TODO - extra uh-oh info?
}


function progress(complete) {
    if (complete === 0) {
        // Page capture has just been initiated.
        show('loading');
    }
    else {
        $('bar').style.width = parseInt(complete * 100, 10) + '%';
    }
}


function splitnotifier() {
    show('split-image');
}


//
// start doing stuff immediately! - including error cases
//

var captureThenSave = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        currentTab = tab; // used in later calls to get tab info

        var filename = getFilename(tab.url);
        CaptureAPI.captureToFiles(tab, filename, displayCaptures,
            errorHandler, progress, splitnotifier);
    });
}

document.getElementById("captureButton").addEventListener("click", function(){
    if (document.getElementById("product_id").value == "" && document.getElementById("website_id").value == "") {
        alert("You can only capture a webshot if you provide a product id and a website id.");
    }
    else {
        captureThenSave();
    }
    
});

chrome.tabs.query({'active': true,'currentWindow':true},function(tab){
    chrome.tabs.sendMessage(tab[0].id,"stuff", function(response){
        chrome.tabs.getSelected(null,function(tab) {
            var tablink = tab.url;
            var a = document.createElement ('a');
            a.href = tablink;
            //alert(a.hostname + a.pathname);
            if (a.hostname == "store.softline.ru") {
                document.getElementById("website_id").value = "https:__store_softline_ru";
            }
            else if (a.hostname == "www.bechtle.com") {
                if (a.pathname[1] + a.pathname[2] + a.pathname[3] == "ch/") {
                    document.getElementById("website_id").value = "bechtle_com_ch";
                }
                else if (a.pathname[1] + a.pathname[2] + a.pathname[3] == "nl/") {
                    document.getElementById("website_id").value = "bechtle_com_nl";
                }
                else if (a.pathname[1] + a.pathname[2] + a.pathname[3] == "fr/") {
                    document.getElementById("website_id").value = "bechtle_com_fr";
                }
                else {
                    document.getElementById("website_id").value = "bechtle_com";
                }
            }
            else if (a.hostname == "www.centralpoint.be") {
                if (a.pathname[1] + a.pathname[2] + a.pathname[3] == "nl/") {
                    document.getElementById("website_id").value = "centralpoint_be_nl";
                }
                else {
                    document.getElementById("website_id").value = "centralpoint_be";
                }
            }
            else if (a.hostname == "www.inmac-wstore.com") {
                document.getElementById("website_id").value = "inmac_wstore_com";
            }
            else {
                document.getElementById("website_id").value = a.hostname.replace("www.", "").replace(".", "_");
            }
            document.getElementById("warning").style.display = "none";
            document.getElementById("week_no").value = new Date().getWeek();
        });
    });
});
    
