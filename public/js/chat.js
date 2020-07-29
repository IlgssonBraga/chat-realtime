/* eslint-disable consistent-return */
/* eslint-disable no-undef */

const socket = io();

const messageForm = document.querySelector('#form-message');
const messageFormInput = messageForm.querySelector('input');
const messageFormButton = messageForm.querySelector('button');
const messages = document.querySelector('#messages');

const sendButton = document.querySelector('#send-location');

// Templates

const messageTemplate = document.querySelector('#message-template').innerHTML;

socket.on('message', message => {
  console.log(message);
  const html = Mustache.render(messageTemplate, { message });
  messages.insertAdjacentHTML('beforeend', html);
});

messageForm.addEventListener('submit', e => {
  e.preventDefault();

  messageFormButton.setAttribute('disabled', 'disabled');

  const message = e.target.elements.message.value;
  socket.emit('sendMessage', message, error => {
    messageFormButton.removeAttribute('disabled');

    messageFormInput.value = '';
    messageFormInput.focus();

    if (error) {
      return console.log(error);
    }

    console.log('Message delivered!');
  });
});

sendButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    // eslint-disable-next-line no-alert
    return alert('Geolocation is not supported by your browser!');
  }

  sendButton.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition(position => {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    socket.emit('sendLocation', { latitude, longitude }, error => {
      if (error) {
        return console.log(error);
      }

      console.log('Location shared!');
      sendButton.removeAttribute('disabled');
    });
  });
});
