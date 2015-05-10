'use strict';

var words;
var shadowHostId = 'va-meaning';

function highlightWords() {
  chrome.storage.local.get('words', function(result) {
    var saved_words;
    if (result) {
      words = result.words;
      saved_words = words.map(function(word) {
        return word.name;
      });
    } else {
      saved_words = ["corruption", "charge", "minister"];
    }

    if ($ && $.fn.highlight) {
      $('body').highlight(saved_words, {wordsOnly: true});
      $('.highlight').mouseenter(showMeaningPopup);
      $('.highlight').mouseleave(hideMeaningPopup);
    }
  });
}

function hideMeaningPopup(e) {
  $('#va-meaning').remove();
}

function showMeaningPopup(e) {
  var $wordElement = $(e.target);
  var wordName = $wordElement.text().trim();
  var meaning = getMeaning(wordName);

  showPopup(wordName, meaning, e);
}

function getMeaning(wordName) {
  wordName = wordName.toLowerCase();
  var word;

  for (var i = 0; i < words.length; i++) {
    word = words[i];
    if (word.name.toLowerCase() === wordName) {
      return word.meaning;
    }
  }
}

function showPopup(name, meanings, e) {
  var $shadowHost = $('<div id="' + shadowHostId + '">');

  var position = {x: e.pageX, y: e.pageY};
  var root = $shadowHost[0].createShadowRoot();
  var popupWidth = 300;
  var popupPadding = 6;
  var popupBorderWidth = 1;
  var popupOuterWidth = popupWidth + 2 * (popupPadding + popupBorderWidth);
  var screenWidth = $(window).width();

  var yPos = position.y + 15;
  var xPos = (position.x > popupOuterWidth / 2) ?
    ((screenWidth - popupOuterWidth/ 2) > e.screenX) ?
    (position.x - popupOuterWidth / 2) : (position.x - e.screenX - (screenWidth - popupOuterWidth/2)) : 0;

  meanings = meanings.split(';');

  var meaningContent = '';
  var meaning;
  for(var i = 0; i < meanings.length; i++) {
    meaning = meanings[i].trim();

    if (!meaning) { continue; }

    meaningContent += '<li class="meaning">' + meaning + '</li>';
  }

  var shadowContent =
  "<style>" +
    ".meaning-popup {" +
      "position: absolute;" +
      "top: " + yPos + "px;" +
      "left: " + xPos + "px;" +
    "}" +
    ".box-wrapper {" +
      "width: " + popupWidth + "px;" +
      "color: rgb(76, 76, 76);" +
      "background: rgb(216, 216, 211);" +
      "font-family: ubuntu;" +
      "font-size: 13px;" +
      "padding: " + popupPadding + "px;" +
      "border: " + popupBorderWidth + "px solid rgb(173, 173, 173);" +
      "box-shadow: 0 1px 4px black;" +
    "}" +
    ".meaning {" +
      "text-align: left;" +
    "}" +
    ".header {" +
      "font-size: 14px;" +
      "font-weight: bold;" +
    "}" +
  "</style>" +

  "<div class='meaning-popup'>" +
    "<div class='box-wrapper'>" +
      "<div class='header'>" +
        "<label>" + name.slice(0, 1).toUpperCase() + name.slice(1) + "</label>" +
      "</div>" +
      "<div class='content'>" +
        "<ol style='padding-left: 20px;'>" +
          meaningContent +
        "</ol>" +
      "</div>" +
    "</div>" +
  "</div>";

  $(root).append($(shadowContent));

  $('body').append($shadowHost[0]);
}

function unhighlightWords() {
  $('body').unhighlight();
}

function getUniqueArray(a) {
  var b = [];

  if (a.length) {
    for (var i = 0; i < a.length; i++) {
      if (b.indexOf(a[i]) === -1) {
        b.push(a[i]);
      }
    }
  }

  return b;
}

highlightWords();

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.highlight == true) {
      unhighlightWords();
      highlightWords();
    }
  }
);
