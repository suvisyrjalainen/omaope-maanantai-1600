document.getElementById('chat-send-button').addEventListener('click', sendChatMessage);

document.getElementById('chat-input').addEventListener('keypress', function (keyPressed) {
  if (keyPressed.key === 'Enter') {
    sendChatMessage();
  }
});


async function sendChatMessage() {
    console.log('Viesti lähetetty');
    const chatUserInput = document.getElementById('chat-input').value;
    console.log(chatUserInput);
    document.getElementById('chat-input').value = '';
    addMessageToChatbox(chatUserInput);

    let response = await fetch('/chat',{
      method:'POST',
      headers:{
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({question: chatUserInput})
    });

    console.log(response);

    if(response.status == 200){
      let data = await response.json();
      console.log(data);
      addMessageToChatbox("Tämä kysymys palautui takaisin: " + data.question);
    }
    else{
      addMessageToChatbox("Tapahtui virhe. Yritä myöhemmin uudelleen");
    }
}

function addMessageToChatbox(message) {
    console.log('Viesti lisätty');
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    console.log(messageElement);
    document.getElementById('chatbox').appendChild(messageElement);

}