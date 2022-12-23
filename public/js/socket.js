$(document).ready(function () {
    $('#action_menu_btn').click(function () {
        $('.action_menu').toggle();
    });
});

const socket = io()

let receiverId = null;
const userId = document.getElementById('userId').value

// user Function
function addDefaultReceiver() {
    const chatBody = document.getElementsByClassName("clickUsers")[0]
    const defaultUser = chatBody.parentElement
    const defaultUserId = defaultUser.getAttribute('data-id')
    receiverId = defaultUserId ? defaultUserId : null
    const senderId = document.getElementById("userId").value
    socket.emit("getMessages", {receiverId, senderId})
}

addDefaultReceiver()

//  Click User Function
const clickUser = document.getElementsByClassName('clickUsers')
for (let i = 0; i < clickUser.length; i++) {
    clickUser[i].addEventListener('click', () => {
        const senderId = document.getElementById("userId").value
        const receiverName = clickUser[i].children[1].getAttribute('data-name')
        receiverId = clickUser[i].parentElement.getAttribute('data-id')
        const user = document.getElementById("show_user")
        const userImg = clickUser[i].children[0].children[0].src
        const showImg = document.getElementById("show_img")
        user.innerHTML = receiverName;
        showImg.src = userImg
        chatBody.innerHTML = " "
        socket.emit("getMessages", {receiverId, senderId})
    })
}

let chatBody = document.getElementById("chat_body")

// Connect Client to server
socket.on('connect', () => {
    console.log("connect")
    const UserID = document.getElementById("userId").value
    socket.emit("join", UserID);
})

// <<<<<<<<<< CHAT BODY >>>>>>
let textarea = document.getElementById("textarea");

textarea.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        let msj = textarea.value;
        if (msj !== undefined) {
            sendMassage(msj)
        }
    }
})

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = event.target.elements.message.value;
    sendMassage(message)
})

function sendMassage(msj) {
    const name = document.getElementById('userName').value

    msjobj = {
        userId, receiverId, message: msj.trim(), name: name,
    }
    appedMessage(msjobj, "outgoing");
    textarea.value = " ";
    socket.emit("sendMessage", msjobj);
    scroll();
}

socket.on("receiveMessage", (message) => {
    if (receiverId === String(message.senderId)) {
        appedMessage(message, "incoming");
        scroll();
    }
});

socket.on("allMessages", (messages) => {
    messages.forEach((message) => {
        const newMessage = {
            message: message.message, name: message.senderId.name
        }
        if (userId === String(message.senderId._id)) {
            appedMessage(newMessage, "outgoing")
        } else {
            appedMessage(newMessage, "incoming");
        }
    })
    scroll();
})

function appedMessage(message, type) {
    let maindiv = document.createElement("div");
    let msjarea = document.getElementById('chat_body')
    maindiv.classList.add(type, "message");
    let markup;
    markup = `<h5>${message.name}</h5>
                  <p>${message.message}</p>`
    maindiv.innerHTML = markup;
    msjarea.appendChild(maindiv);
}





