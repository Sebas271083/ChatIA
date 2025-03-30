const sendButton = document.getElementById('sendButton');
const message = document.querySelector("#inputText")
const messagesContainer = document.querySelector(".chat_messages");
const userId = Date.now() + Math.floor(Math.random() * 1000);
const nombre = document.querySelector("#nombre");   
const apellido = document.querySelector("#apellido");

const sendMessage = async () => {
    //sacar el valor del input
    const myMessage = message.value.trim();
    const nombreUsuario = nombre.value.trim();
    const apellidoUsuario = apellido.value.trim();

    if(!myMessage){
        return false;
    }
    //Meter el mensaje del usuario en la caja de mensajes
    messagesContainer.innerHTML += `<div class="chat__message chat__message--user">YO: ${myMessage}</div>`;
    //vaciar el input del usuario
    message.value = "";

    //Peticion al backend
    try {
        const response = await fetch('/api/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                myMessage,
                nombre: nombreUsuario,
                apellido: apellidoUsuario
            })
        });

        //Incrustar mensaje del bot en el chat
        const data = await response.json();
        messagesContainer.innerHTML += `<div class="chat__message chat__message--bot">Carmen: ${data.message}</div>`;
        
    } catch (error) {
        console.log('Error:', error);
    }


    //Mover scroll al final del chat
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

}

sendButton.addEventListener('click', sendMessage)
message.addEventListener('keypress', (e) => {
    if(e.key === 'Enter'){
        e.preventDefault();
        sendMessage();
    }
})