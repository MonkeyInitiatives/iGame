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

        console.log("CHAT BUTTON CLICKED");
        socket.emit("chat", {
            chatName: chatName.text(),
            chatMessage: chatMessage.val()
        });
        chatMessage.val();
    });

    // Check if user is typing
    chatMessage.keypress(function () {
        socket.emit("typing", data.chatName)
    });

    // Listen for events 
    socket.on("chat", function (data) {
        console.log(data)
        // output data to DOM
        chatOutput.text(data.chatName + ": " + data.chatMessage);
    });

    socket.on("typing", function (data) {
        chatFeedback.text(chatName + " is typing a message...");
        console.log("chatname: " + data.chatName)
    });
});