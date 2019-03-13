$(document).ready(function () {

    // Make connection on front end
    let socket = io();

    // Get references to page elements
    let chatName = $("#chat-name");
    let chatMessage = $("input#chat-message");
    let chatSendBtn = $("#chat-send-btn");
    let chatOutput = $("#chat-output");
    let chatFeedback = $("#chat-feedback");

    // Emit events
    chatSendBtn.on("click", function (e) {
        e.preventDefault();
        socket.emit("chat", {
            chatName: chatName.val(),
            chatMessage: chatMessage.val()
        });
<<<<<<< HEAD
        chatMessage.val("");
=======

        chatMessage.val("");

>>>>>>> 4f8220c1316ee8c76a7ac880dd98ac4fd2c97bd8
    });

    // Check if user is typing
    chatMessage.keypress(function () {
<<<<<<< HEAD
        socket.emit("typing", chatName.val())
=======

        socket.emit("typing", chatName.val())

>>>>>>> 4f8220c1316ee8c76a7ac880dd98ac4fd2c97bd8
    });

    // Listen for events 
    socket.on("chat", function (data) {
        // console.log(data)
        // output data to DOM
<<<<<<< HEAD
=======

>>>>>>> 4f8220c1316ee8c76a7ac880dd98ac4fd2c97bd8
        chatFeedback.val("");
        chatOutput.append($('<p>').text(data.chatName + ": " + data.chatMessage));
    });

    socket.on("typing", function (data) {
        chatFeedback.text(data + " is typing a message...");
        // console.log("chatname: " + data)
<<<<<<< HEAD
=======

>>>>>>> 4f8220c1316ee8c76a7ac880dd98ac4fd2c97bd8
    });
});