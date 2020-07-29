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

document.querySelector('#send-location').addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser!');
  }

  navigator.geolocation.getCurrentPosition(position => {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    socket.emit('sendLocation', { latitude, longitude });
  });
});
