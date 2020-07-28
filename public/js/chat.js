/* eslint-disable no-undef */
const socket = io();

socket.on('message', message => {
  console.log(message);
});

document.querySelector('#form-message').addEventListener('submit', e => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  socket.emit('sendMessage', message);
});
