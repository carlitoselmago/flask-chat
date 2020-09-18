window.loaded = false;

$(document).ready(function() {
  window.originalTitle = document.title;
  window.posted = false;
  window.marion = false;
  window.unseen = 0;
  window.favicon = new Favico({
    animation: 'popFade'
  });
  var icon = document.getElementById('favicon');
  window.favicon.image(icon);

  if ($("#burger").length) {
    window.marion = true;
  }
  window.talker = $("#messages").attr("to");
  window.connected = true;

  //chat 100vh mobile hack
  mobile100vh();
  createAlertSound();

  $(window).resize(function() {
    mobile100vh();
  });

  //login
  $("#signinbutton").click(function(e) {
    e.preventDefault();

    $("#signinform").slideDown();
  });

  $("#messagebox").keyup(function() {
    $(".messageinputwrap").addClass("typing");
  });

  $(".send").click(function() {
    $("#inputuser").submit();
  });

  $("body").on("click", ".flashes li", function() {
    $(this).remove();
  });

  $(window).focus(function() {
    clearNotify();
  });

  $("#inputuser").submit(function(e) {
    var text = $("#messagebox").val();
    e.preventDefault(); // avoid to execute the actual submit of the form.

    var form = $(this);
    var url = form.attr('action');
    /*
    if (window.loaded) {
      if ($(".message:last").length > 0) {
        url = url + '?last=' + $(".message:last").attr("date");
      }
    }
    */

    $.ajax({
      type: "POST",
      url: url,
      data: form.serialize(), // serializes the form's elements.
      success: function(data) {
        window.connected = true;

        //handleMessagesAPI(url,data);
        updateMessages(true);
        $(".messageinputwrap").removeClass("typing");

      },
      error: function(data) {
        showError("Votre message n'a pas pu être envoyé");
        $("#messagebox").val(text);

      },
      timeout: function(data) {
        showError("Votre message n'a pas pu être envoyé");
        $("#messagebox").val(text);
      }
    });

    $("#messagebox").val("");

  });

  function start() {
    //setTimeout(updateMessages(), 2000); // milliseconds
    updateMessages();
    setInterval(function() {
      updateMessages(true);
    }, 1000);
    console.log("START");
    //  document.getElementById("messagebox").focus();
  }

  if ($("#messages").length) {
    start();
  }

});


function scrollDown() {
  setTimeout(function() {
    $('#messages').scrollTop($('#messages')[0].scrollHeight);
  }, 100);

}

function checkMessagesSeen() {
  var markasseen = [];
  $(".message").each(function(index) {
    if ($(this).attr('seen') == "0") {
      if ($(this).is(':visible')) {
        markasseen.push(parseInt($(this).attr("id")));
      }
    }
  });
  var url = "/markasseen"
  $.ajax({
    method: "POST",
    url: url,
    data: {
      "seen": markasseen
    },
    success: function(data) {
      console.log("marked as seen", markasseen);
    }
  });
}

function updateMessages(scrolldownatend = false, forceLoadAll = false) {
  var url = '/messages';

  if (window.talker) {
    url = "/messages?id=" + window.talker;
  }
  if (!forceLoadAll) {
    if (window.loaded) {
      if ($(".message:last").length > 0) {
        url = url + '&last=' + $(".message:last").attr("date");
      }
    }
  }

  $.ajax({
    type: "GET",
    url: url,
    success: function(data) {

      //if ($($.parseHTML(document.getElementById('messages').innerHTML)).length != $($.parseHTML(data)).length) {
      //new messages
      //document.getElementById('messages').innerHTML = data;

      //new memory effective way
      handleMessagesAPI(url, data, scrolldownatend);
      window.posted = false;
      if (window.connected == false) {
        showError("Connexion au serveur rétablie", 2);
      }

      window.connected = true;
    },
    error: function(data) {
      showError("Déconnexion du serveur", 1);
      window.connected = false;
    },
    timeout: function(data) {
      showError("Déconnexion du serveur", 1);
      window.connected = false;
    },
  });
}

//draganddrop

$(document).on('click', '#upload-btn', function(e) {
  //  $(".dropzone").show();
  $(".dropzone").trigger("click");
});

$(document).on('dragenter', '#messages', function(e) {
  $(".dropzone").show();
  $('#messages').hide();
  $("#drop").addClass("hover");
});

$(document).on('dragleave', '#myDropzone', function(e) {
  $('#messages').show();
  $(".dropzone").hide();
  $("#drop").removeClass("hover");
});

function handleMessagesAPI(url, data, scrolldownatend = false) {
  var dom = $('<div></div>').html(data);
  if (url.includes("last")) {
    $(".message", dom).each(function(index) {
      var newMid = $(this).attr("id");
      if ($("#messages .message#" + newMid).length == 0) {
        $("#messages").append($(this).parent().html());
      }
    });



  } else {
    document.getElementById('messages').innerHTML = data;
  }
  //end new memory way

  if (window.loaded) {
    if (!window.marion) {
      if (data.length > 0) {

        //only if marion messages
        var newMm = 0;

        $(dom).find(".message").each(function() {
          if (!$(this).hasClass("me")) {
            newMm++;
          }
        });

        //notify($(dom).find(".message").length);
        notify(newMm);
        //window.audioElement.play();
      }
    }
  }
  if (!window.loaded) {

    if ($("#messages img").length) {
      $("#messages img").on("load", function() {
        if (data.length > 0) {
          scrollDown();
        }

      });
    } else {
      if (data.length > 0) {
        scrollDown();
      }
    }
  }
  if (scrolldownatend) {
    if (data.length > 0) {
      scrollDown();
    }
  }
  //}
  window.loaded = true;
}

function createAlertSound() {
  window.audioElement = document.createElement('audio');
  window.audioElement.setAttribute('src', 'static/cuak.mp3');
}

function mobile100vh() {
  if ($("#messages").length) {
    var extra = 109;

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      $(".heightfix,.dropzone").height(window.innerHeight - extra);
    }
  }
}

function showError(text, mode = 0) {
  //modes: 0 add, 1 add if not already shown, 2 not error but info (positive)
  if ($(".flashes").length == 0) {
    $("body").append('<ul class="flashes"></ul>');
  }
  if (mode == 1) {

    if ($('.flashes:contains("' + text + '")').length == 0) {
      $(".flashes").append('<li>' + text + '</li>');
    }
  } else {
    if (mode == 2) {

      $(".flashes").html('<li class="success">' + text + '</li>');
      setTimeout(function() {
        $(".flashes .success").fadeOut("slow");
      }, 3000);

    } else {
      $(".flashes").append('<li>' + text + '</li>');
    }
  }
}


function fileSucces() {
  $('#messages').show();
  $(".dropzone").hide();
  $("#drop").removeClass("hover");
}

function notify(newMessagesNum) {
  //var newTitle = '(' + newMessagesNum + ') ' + window.originalTitle;
  //document.title = newTitle;
  window.unseen += newMessagesNum;
  window.favicon.badge(window.unseen);
}

function notifySpecific(newMessagesNum) {
  //var newTitle = '(' + newMessagesNum + ') ' + window.originalTitle;
  //document.title = newTitle;
  window.favicon.badge(newMessagesNum);
}

function clearNotify() {
  window.unseen = 0;
  window.favicon.reset();
  if (window.marion) {
    var speakerID = $(".speaker.active").attr("id");
    //$(".speaker.active .notseen").remove();

    $.ajax({
      type: "POST",
      dataType: 'html',
      url: "/updatechatid",
      data: {
        chatid: speakerID
      }
    });

  }
}
