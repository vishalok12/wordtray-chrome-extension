'use strict';

function showWordsFromStorage() {
  debugger;
  chrome.storage.local.get('words', function(result) {
    if (result) {
      showWordsInPopup(result);
    }
  });
}

showWordsFromStorage();

function createInputTags(tags) {
  var html = '';

  for (var i = 0; i < tags.length; i++) {
    html += createInputTag(tags[i]);
  }

  return html;
}

function createInputTag(tag) {
  return '<span class="input-tag">' +
    '<div class="it-word">' + tag + '</div>' +
    '<div class="it-delete-btn">x</div>' +
    '</span>';
}

function reHighlightWords() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {highlight: true});
  });
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

function showWordsInPopup(saved_words) {
  saved_words = pluck(saved_words.words, 'name');

  $('body').html(createInputTags(saved_words));
  // $('.it-delete-btn').click(function() {
  //   var $wordTag = $(this).parent();
  //   var word = $wordTag.find('.it-word').text();
  //   $wordTag.remove();
  //   removeWordFromStore(word, reHighlightWords);
  // });
}
