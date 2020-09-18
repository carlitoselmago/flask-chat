$(document).ready(function() {

  setSpeakerTo($(".speaker").eq(0).attr("id"));

  window.marion = true;
  $("body").on("click", "#burger", function(e) {
    $("body").addClass("menuopen");
    e.preventDefault();
  });

  $("#speakers").on("click", ".archive", function(e) {
  //  e.preventDefault();
    e.stopPropagation();
    e.preventDefault();
    var userid = $(this).parent().attr("id");
    $(this).closest(".speaker").slideUp();
  //  $(this).closest(".speaker").hide();
    $("#messages").html("");
    $.ajax({
      type: "GET",
      dataType: 'html',
      url: "/archiveuser?id="+userid,
      success: function(data) {
        //$("#speakers").html("");
        //updateSpeakers(window.talker);
      }
    });
  });

  $("#speakers").on("click", ".speaker", function(e) {

    $("#messages").html("");

    e.preventDefault();
    var speakerID = $(this).attr("id");
    window.talker = speakerID;
    setSpeakerTo(speakerID);

    $("#messagebox").val("");

    $("#to").attr("value", window.talker);
    $(".speaker").removeClass("active");
    $(this).addClass("active");
    $.ajax({
      type: "POST",
      dataType: 'html',
      url: "/updatechatid",
      data: {
        chatid: speakerID
      },
      success: function(data) {

        updateMessages(true, true);
        $(".speaker#" + speakerID + " .notseen").hide();
        $("body").removeClass("menuopen");
      },

    });
  });

  setInterval(function() {
    updateSpeakers(window.talker);
  }, 10000);

});

function postLoadSpeakers() {
  var newDOM = $("#preload").children();
  console.log($("#speakers").children().html().length);
  console.log($("#preload").children().html().length);

  if ($("#speakers").children().html() === $("#preload").children().html()) {
    //if ($("#speakers").children()[0] === $("#preload").children()[0]) {
    console.log("son iguales");

  } else {
    //if ($("#speakers").children().html().length!== $("#preload").children().html().length) {
    console.log("son speakers diferentes");
    if (newDOM.html().includes('class="notseen"')) {
      //window.audioElement.play();
    }
    $("#speakers").html($("#preload").html());
  }
  var newM = 0;
  $("#speakers .notseen").each(function() {
    newM += parseInt($(this).text());
  });

  notifySpecific(newM);

}

function updateSpeakers(speaker = false) {

  if (speaker) {
    $("#preload").load("/speakers?speaker=" + speaker, function() {
      postLoadSpeakers();
    });
  } else {
    $("#preload").load("/speakers", function() {
      postLoadSpeakers();
    });
  }
}

function setSpeakerTo(speakerID) {
  $("#speakers #" + speakerID).addClass("active");
  window.talker = speakerID;
  $("#to").attr("value", speakerID);
}
