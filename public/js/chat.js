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
            chatName: chatName.text(),
            chatMessage: chatMessage.val()
        });
    });

    // Check if user is typing
    chatMessage.keypress(function () {
        socket.emit("typing", chatName.text())
    });

    // Listen for events 
    socket.on("chat", function (data) {
        // console.log(data)
        // output data to DOM
        chatOutput.append($('<p>').text(chatName.text() + ": " + data.chatMessage));
        chatMessage.val("");
        chatFeedback.text("");
    });

    socket.on("typing", function () {
        chatFeedback.text(chatName.text() + " is typing a message...");
    });
});