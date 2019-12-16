// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let loadScript = document.getElementById('loadScript');
loadScript.onclick = function(element) {
    let code = 'var s = document.createElement("script");s.src = chrome.extension.getURL("custom.js");(document.head||document.documentElement).appendChild(s);console.log("Here");';
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
          tabs[0].id,
          {code: code});
    });
};