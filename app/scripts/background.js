'use strict';

/**
 * Fetch new/updated/deleted words from server periodically
 */
var alarmName = 'fetchUpdatedWords';

function createAlarm() {
  chrome.alarms.create(alarmName, {
    delayInMinutes: 0.1,
    periodInMinutes: 1
  });
}

function cancelAlarm() {
  chrome.alarms.clear(alarmName);
}

createAlarm();

chrome.alarms.onAlarm.addListener(function( alarm ) {
  fetchWordsFromServer();
});

function fetchWordsFromServer(userId) {
  $.ajax({
    url: "http://www.wordtray.com/api/words",
    type: 'GET',
    success: function(data) {
      // saved_words = data;
      // showWordsInPopup(saved_words);
      syncWords(pluck(data, ['name', 'meaning']));
    },
    error: function() {
      // alert("username or password is wrong!");
      // alert("some error while fetching words from server!");
      // showWordsFromStorage();

      chrome.tabs.create({ url: 'options.html' });
    }
  });
}

function syncWords(words, callback) {
  chrome.storage.local.set({words: words}, callback);
}

function pluck(arr, property) {
  return arr.map(function(val) {
    if (typeof property === 'string') { return val[property] };

    var newVal = {};
    for (var i = 0; i < property.length; i++) {
      newVal[property[i]] = val[property[i]];
    }

    return newVal;
  });
}
