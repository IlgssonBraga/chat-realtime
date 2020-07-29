/* eslint-disable consistent-return */
/* eslint-disable no-undef */
const socket = io();

socket.on('message', message => {
  console.log(message);
});

document.querySelector('#form-message').addEventListener('submit', e => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  socket.emit('sendMessage', message, error => {
    if (error) {
      return console.log(error);
    }

    console.log('Message delivered!');
  });
});

document.querySelector('#send-location').addEventListener('click', () => {
  if (!navigator.geolocation) {
    // eslint-disable-next-line no-alert
    return alert('Geolocation is not supported by your browser!');
  }

  navigator.geolocation.getCurrentPosition(position => {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    socket.emit('sendLocation', { latitude, longitude }, error => {
      if (error) {
        return console.log(error);
      }

      console.log('Location shared!');
    });
  });
});
