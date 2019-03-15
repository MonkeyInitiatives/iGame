// Get references to page elements
let $exampleText = $("#example-text");
let $exampleDescription = $("#example-description");
// let $submitBtn = $("#submit");
let $exampleList = $("#example-list");

// The API object contains methods for each kind of request we'll make
let API = {
  saveExample: function (example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/games",
      data: JSON.stringify(example)
    });
  },
  getExamples: function () {
    return $.ajax({
      url: "api/games",
      type: "GET"
    });
  },
  deleteExample: function (id) {
    return $.ajax({
      url: "api/games/delete" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
let refreshExamples = function () {
  API.getExamples().then(function (data) {
    let $examples = data.map(function (example) {
      let $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      let $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      let $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
let handleFormSubmit = function (event) {
  event.preventDefault();

  let example = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim()
  };

  if (!(example.text && example.description)) {
    alert("You must enter an example text and description!");
    return;
  }

  API.saveExample(example).then(function () {
    refreshExamples();
  });

  $exampleText.val("");
  $exampleDescription.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
let handleDeleteBtnClick = function () {
  let idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function () {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
// $submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);

//when the search button is clicked, it calls the post route that then calls the igdb api.
$(document).ready(function () {
  $('.accentColor').each(function () {
    var accentcolor = $("#inputColor").val().trim()
    $(this).attr('style', 'background-color:' + accentcolor + ' !important');
  })

  var backgroundimage = "./images/default-background.png";
	if ($("#inputBackground").val() === "") {
      backgroundimage = $("#inputBackground").attr("placeholder");
    } else {
      backgroundimage = $("#inputBackground").val();
    }
    $("body").css("background-image", "url('" + backgroundimage + "')");  

    // Transition effect for navbar 
    $(window).scroll(function () {
        // if window is scrolled more than 25px, add/remove solid class
        if ($(this).scrollTop() > 250) {
            $('.navbar').addClass('solid');
        } else {
            $('.navbar').removeClass('solid', 'links');
        }
    });

    // Change iGame title on hover
    $(".igame-title").hover(function(){
      $(this).css("color", "pink");
    });


  // Transition effect for navbar 
  $(window).scroll(function () {
    // if window is scrolled more than 25px, add/remove solid class
    if ($(this).scrollTop() > 250) {
      $('.navbar').addClass('solid');
    } else {
      $('.navbar').removeClass('solid');
    }
  });

  $('.friend-list').each(function () {
    if ($(this).attr("data-friendStatus") === "rejected") {
      $(this).hide();
    } else if ($(this).attr("data-friendStatus") === "accepted") {
      console.log($(this));
      $(this).append("<button type='button' class='btn btn-primary text-center rounded my-2 my-sm-0 showFriendLibrary' data-requestID=" + $(this).attr("data-requestID") + " data-name=" + $(this).attr("data-name") + " data-rating=" + $(this).attr("data-rating") + " data-hypes=" + $(this).attr("data-hypes") + " data-summary=" + $(this).attr("data-summary") + " data-poster=" + $(this).attr("data-poster") + " data-releasedate=" + $(this).attr("data-releasedate") + " data-slug=" + $(this).attr("data-slug") + " >" + $(this).attr("data-requestName") + "'s Library</button>");
    } else if ($(this).attr("data-friendStatus") === "pending") {
      $(this).prepend("<strong>Pending:</strong> " + $(this).attr("data-requestName"));
    }
  });
  $('.friend-requests').each(function () {
    if ($(this).attr("data-friendStatus") === "pending" && ($(this).attr("data-requestID") !== $(this).attr("data-userID"))) {
      $(this).append("<button type='button' class='btn btn-primary text-center rounded my-2 my-sm-0 rejectFriend' data-userID=" + $(this).attr("data-userID") + " data-requestID=" + $(this).attr("data-requestID") + " data-requestName=" + $(this).attr("data-requestName") + ">Reject</button>");
      $(this).append("<button type='button' class='btn btn-primary text-center rounded my-2 my-sm-0 addFriend' data-userID=" + $(this).attr("data-userID") + " data-requestID=" + $(this).attr("data-requestID") + " data-requestName=" + $(this).attr("data-requestName") + ">Accept</button>");
    } else if ($(this).attr("data-requestID") !== $(this).attr("data-userID")) {
      $(this).remove();
    }
  });

  $(".showFriendLibrary").on("click", function (cb) {
    console.log($(this).attr("data-requestID"));
    $.post("/api/friends/library/", {
      friendID: $(this).attr("data-requestID")
    }).then(function (results) {
      console.log(results);
      $("#friendModalInsertion").empty();
      $('.addToLibrary').each(function () {
        $(this).attr("onclick", "").unbind("click");
      });
      for (var i = 0; i < results.length; i++) {
        // $("#friendModalInsertion").append(results[i].name);
        // console.log(results[i].slug);
        $("#friendModalInsertion").append("<button type='button' style='display: inline-block; 'class='btn btn-primary text-center rounded my-2 my-sm-0 addToLibrary btn-sm' data-name='" + results[i].name + "' data-rating='" + results[i].rating + "' data-hypes='" + results[i].hypes + "' data-summary='" + results[i].summary + "' data-poster='" + results[i].poster + "' data-releasedate='" + results[i].releasedate + "' data-slug='" + results[i].slug + "'>Add " + results[i].name + " to your library</button>");
        $("#friendModalInsertion").append("<br />");
      }
      $(".addToLibrary").on("click", function (cb) {
        event.preventDefault();
        $.post("/api/games/addFromFriendList/", {
          name: $(this).attr("data-name"),
          rating: $(this).attr("data-rating"),
          slug: $(this).attr("data-slug"),
          poster: $(this).attr("data-poster"),
          hypes: $(this).attr("data-hypes"),
          summary: $(this).attr("data-summary"),
          releasedate: $(this).attr("data-releasedate")
        }).then(function (results) {
          window.location.href = "/library";
        })
      });
      $("#friendModal").modal("toggle");
    });
  });

  $(".addFriend").on("click", function (cb) {
    console.log("My ID: " + $(this).attr("data-userID"));
    console.log("Friend ID: " + $(this).attr("data-requestID"));
    console.log("add friend");
    $.post("/api/friends/add/", {
      userID: $(this).attr("data-userID"),
      requestID: $(this).attr("data-requestID"),
      requestName: $(this).attr("data-requestName")
    }).then(function (results) {
      window.location.href = "/library";
    })
  });
  $(".rejectFriend").on("click", function (cb) {
    $.post("/api/friends/reject/", {
      requestID: $(this).attr("data-requestID"),
      userID: $(this).attr("data-userID")
    }).then(function (results) {
      window.location.href = "/library";
    })
  });

  var options = {
    data: [],
    getValue: function (element) {
      return element.name;
    },
    placeholder: "Search your library",
  };
  $('.game-object').each(function () {
    var theobject = {
      "name": $(this).text()
    };
    options.data.push(theobject);
  });
  console.log(options.data);
  options.list = {
    match: {
      enabled: true
    },
    onChooseEvent: function () {
      console.log($("#basics").val());
      $('.modal').each(function () {

        if ($(this).text().includes($("#basics").val())) {
          $(this).modal("toggle");
        }
      });
    }
  };
  $("#basics").easyAutocomplete(options);


  $(".save-user-data").on("click", function (cb) {
    var avatar = "./images/default-avatar.png";
    var backgroundimage = "./images/default-background.png";
    var accentcolor = $("#inputColor").val().trim()
    if ($("#inputAvatar").val().trim() === "") {
      avatar = $("#inputAvatar").attr("placeholder");
    } else {
      avatar = $("#inputAvatar").val().trim();
    }
    if ($("#inputBackground").val().trim() === "") {
      backgroundimage = $("#inputBackground").attr("placeholder");
    } else {
      backgroundimage = $("#inputBackground").val().trim();
    }
    $.post("/api/update_user", {
      avatar: avatar,
      backgroundimage: backgroundimage,
      accentcolor: $("#inputColor").val().trim()
    }).then(function (results) {
      $("body").css("background-image", "url('" + backgroundimage + "')");
      $('.accentColor').attr('style', 'background-color:' + accentcolor + ' !important');
      $('#userAvatar').attr('src', avatar);
    })
  });

  $("#friendButton").on("click", function (cb) {
    event.preventDefault();
    $.ajax({
      method: "POST",
      url: "/api/friends/" + $("#friendText").val().trim()
    }).then(function (results) {
      console.log(results);
      window.location.href = "/library";
    });
  });

  // Gamelist buttons scroll on click
  $("#right-button").click(function () {
    event.preventDefault();
    $("#gamelist-wrapper").animate({
      scrollLeft: "+=400px"
    }, "slow");
  });

  $("#left-button").click(function () {

    event.preventDefault();
    $("#gamelist-wrapper").animate({
      scrollLeft: "-=400px"
    }, "slow");
  });

  $(".deleteGame").on("click", function (cb) {
    event.preventDefault();
    console.log($(this).attr("data-slug"));
    console.log($(this).attr("data-userID"));
    $.post("/api/games/delete/", {
      game: $(this).attr("data-slug"),
      userID: $(this).attr("data-userID")
    }).then(function (results) {
      console.log(results);
      window.location.href = "/library";
    });
  });

  $("#searchButton").on("click", function (cb) {
    event.preventDefault();

    let gameToSearch = $("#searchText").val();
    $.ajax({
        method: "POST",
        url: "/api/search/" + gameToSearch
      })
      .then(function (results) {
        // console.log("This is the result: " + results.length);
        $("#searchModalInsertion").empty();
        $(".addLibrary").attr("onclick", "").unbind("click");
        for (let i = 0; i < results.length; i++) {
          $("#searchModalInsertion").append("<h2>" + results[i].name + "</h2>");
          $("#searchModalInsertion").append("<p>" + results[i].summary + "</p>");
          $("#searchModalInsertion").append("<button type='button' class='btn my-2 my-sm-0 addLibrary' data-gameID=" + results[i].id + ">Add to Library</button><br><br><hr>");
        }
        // jQuery.noConflict();
        $("#searchModal").modal("toggle")
        $(".addLibrary").on("click", function (cb) {
          event.preventDefault();
          // console.log("Hello");
          // console.log($(this).attr("data-gameID"));
          getTitle($(this).attr("data-gameID"));
        });
      })
  });
});

function getTitle(theTitle) {
  $.ajax({
      method: "POST",
      url: "/api/searchTitle/" + theTitle
    })
    .then(function (results) {
      window.location.href = "/library";
    });
}