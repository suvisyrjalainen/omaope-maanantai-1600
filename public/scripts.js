document.getElementById('chat-send-button').addEventListener('click', sendChatMessage);

document.getElementById('chat-input').addEventListener('keypress', function (keyPressed) {
  if (keyPressed.key === 'Enter') {
    sendChatMessage();
  }
});


function sendChatMessage() {
    console.log('Viesti lähetetty');
    const chatUserInput = document.getElementById('chat-input').value;
    console.log(chatUserInput);
    document.getElementById('chat-input').value = '';
    addMessageToChatbox(chatUserInput);

    fetch('/get-question',{
      method:'POST',
      headers:{
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({question: chatUserInput})
    });
}

function addMessageToChatbox(message) {
    console.log('Viesti lisätty');
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    console.log(messageElement);
    document.getElementById('chatbox').appendChild(messageElement);

}