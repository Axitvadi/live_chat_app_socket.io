$(document).ready(function () {
    $('#action_menu_btn').click(function () {
        $('.action_menu').toggle();
    });
});

const socket = io();

socket.on('message', function (message) {
    console.log(message)
})

const form = document.getElementById('form');

form.addEventListener('submit',  (event) => {
    event.preventDefault();
    const message = event.target.elements.message.value;
    console.log(message);
})
