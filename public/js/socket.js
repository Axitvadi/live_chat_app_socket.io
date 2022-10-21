$(document).ready(function () {
    $('#action_menu_btn').click(function () {
        $('.action_menu').toggle();
    });
});

const socket = io();

let receiverId = null;

// socket.on('message', function (message) {
//     console.log(`User : ${message}`)
// })

// socket.on('connect', () => {
//     const name =  document.getElementById('userName').value
//     socket.emit('joinUser',`${name} join` )
    
// })
// socket.on('connect', () => {
//     let name =  document.getElementById('userName').value
//     let message = `${name} Has Joined Chat !!`
//     const userObj = {
//         name : name,
//         message : message
//     }
//     socket.emit('joinUser',userObj )
//     socket.emit('left',name)
    
// })

// const form = document.getElementById('form');


// socket.on('joinUserInfo', (data)=>{
//     console.log(data.name);
//     console.log(data.message);
// })

// form.addEventListener('submit',  (event) => {
//     event.preventDefault();
//     const message = event.target.elements.message.value;
//     console.log(message);
// })


// <<<<<<<<<< CHAT BODY >>>>>>

let textarea = document.getElementById("textarea");
let msjarea = document.getElementById("chat_body");

textarea.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        let msj = textarea.value;
        sendMassage(msj)
    }
})

form.addEventListener('submit',  (event) => {
    event.preventDefault();
    const message = event.target.elements.message.value;
    console.log(message);
    sendMassage(message)  
})

function sendMassage(msj) {
    
    const name =  document.getElementById('userName').value
    const userId =  document.getElementById('userId').value
    
    msjobj = {
    userId,
    receiverId,
    usermsj: msj.trim()
    }
    
    appedMessage(msjobj, "outgoing");
    textarea.value = "";
    
    socket.emit("message", msjobj);   
    scroll();
};

socket.on("serverMsj", (serverSideMsj) => {
    appedMessage(serverSideMsj, "incoming");
    scroll();
});


function appedMessage(msjobj, type) {

    let maindiv = document.createElement("div");
    maindiv.classList.add(type, "message");

    let markup = `
    <h5> ${msjobj.username} </h5>
    <p> ${msjobj.usermsj} </p>
    `
    maindiv.innerHTML = markup;

    msjarea.appendChild(maindiv);
}

function scroll() {
    msjarea.scrollTop = msjarea.scrollHeight;
}


const activeUsers = document.getElementsByClassName("active")

for(let activeUser = 0; activeUser < activeUsers.length; activeUser++ ){
    activeUsers[activeUser].addEventListener('click', () => {

        receiverId = "634f65ed0604a8ce873f4a6d"
        console.log("success");
    })
}