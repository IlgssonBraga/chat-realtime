/* eslint-disable no-restricted-globals */
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
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// const { username, room } = qs.parse(location.search, {
//   ignoreQueryPrefix: true,
// });

const username = location.search.substring(1).split('&')[0].split('=')[1];
const room = location.search.substring(1).split('&')[1].split('=')[1];

const autoscroll = () => {
  const newMessage = messages.lastElementChild;

  const newMessageStyles = getComputedStyle(newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

  const visibleHeight = messages.offsetHeight;

  const containerHeight = messages.scrollHeight;

  const scrollOffset = messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    messages.scrollTop = messages.scrollHeight;
  }
};

socket.on('message', message => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('H:mm'),
  });
  messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
});

socket.on('locationMessage', message => {
  console.log(message);
  const html = Mustache.render(locationTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format('H:mm'),
  });
  messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
});

socket.on('roomData', ({ room: roomName, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    roomName,
    users,
  });
  document.querySelector('#sidebar').innerHTML = html;
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

socket.emit('join', { username, room }, error => {
  if (error) {
    // eslint-disable-next-line no-alert
    alert(error);
    location.href = '/';
  }
});
