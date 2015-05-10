'use strict';

function getUserId() {
  // $.ready(function() {
    $('#signin-btn').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      var email = $('#signin-email').val().trim();
      var password = $('#signin-password').val().trim();

      $.ajax({
        url: "http://www.wordtray.com/session",
        type: 'POST',
        data: {
          username: email,
          password: password
        },
        success: function(data) {
          alert('success');
          console.log(data);
          // storeUserId(data.userId);
        },
        error: function() {
          alert("username or password is wrong!");
        }
      });
    });
  // });
}

getUserId();

function storeUserId(userId) {
  chrome.storage.local.set({userId: userId}, function() {
    alert("saved!");
  });
  // fetchWordsFromServer(userId);
}
