$(document).ready(function () {
    $('#action_menu_btn').click(function () {
        $('.action_menu').toggle();
    });
});

const socket = io();

socket.on('message', function (message) {
    console.log(`User : ${message}`)
})

// socket.on('connect', () => {
//     const name =  document.getElementById('userName').value
//     socket.emit('joinUser',`${name} join` )
    
// })
socket.on('connect', () => {
    let name =  document.getElementById('userName').value
    let message = `${name} Has Joined Chat !!`
    const userObj = {
        name : name,
        message : message
    }
    socket.emit('joinUser',userObj )
    socket.emit('left',name)
    
})

const form = document.getElementById('form');


socket.on('joinUserInfo', (data)=>{
    console.log(data.name);
    console.log(data.message);
})

form.addEventListener('submit',  (event) => {
    event.preventDefault();
    const message = event.target.elements.message.value;
    console.log(message);
})
