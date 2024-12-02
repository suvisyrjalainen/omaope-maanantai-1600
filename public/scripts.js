document.getElementById('chat-send-button').addEventListener('click', sendChatMessage);

document.getElementById('chat-input').addEventListener('keypress', function (keyPressed) {
  if (keyPressed.key === 'Enter') {
    sendChatMessage();
  }
});


document.getElementById('send-images-button').addEventListener('click', sendImages);


async function sendChatMessage() {
    console.log('Viesti lähetetty');
    const chatUserInput = document.getElementById('chat-input').value;
    console.log(chatUserInput);
    document.getElementById('chat-input').value = '';
    addMessageToChatbox(chatUserInput, "user-message");

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
      addMessageToChatbox("ChatGPT: " + data.answer, "bot-message");
    }
    else{
      addMessageToChatbox("ChatGPT: Tapahtui virhe. Yritä myöhemmin uudelleen", "bot-message");
    }
}

function addMessageToChatbox(message, className)
  {
    console.log('Viesti lisätty');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.innerText = message;
    console.log(messageElement);
    document.getElementById('chatbox').appendChild(messageElement);

}

async function sendImages(){
  const imageInput = document.getElementById('image-input');
  const files = imageInput.files;
  console.log(files);

  const formData = new FormData();
  
  for (const file of files) {
    formData.append('images', file);
  }

  //logataan että nähdään tiedostot
  console.log(formData.getAll('images'));

  const response = await fetch('/upload-images', {
    method: 'POST',
    body: formData
  });

  if (response.status === 200) {
    const data = await response.json();
    console.log(data.message);
  }
  else{
    console.log('Virhe tiedostojen lähetyksessä');
    console.log(response);
    const data = await response.json();
    console.log(data.error);
  }
}
