$(document).ready(function () {
    // Make connection on front end
    let socket = io.connect("http://localhost:3000/")

    // Get references to page elements
    let chatName = $("input#chat-name");
    let chatMessage = $("input#chat-message");
    let chatSendBtn = $("#chat-send-btn");
    let chatOutput = $("#chat-output");

    // Emit events
    chatSendBtn.on("click", function (e) {
        e.preventDefault();

        console.log("CHAT BUTTON CLICKED");
        socket.emit("chat", {
            chatName: chatName.val(),
            chatMessage: chatMessage.val(),
        });
    });

    // Listen for events 
    socket.on("chat", function (data) {
        console.log(data)
        // output data to DOM
        chatOutput.text(data.chatName + ": " + data.chatMessage);
    });
});