/* eslint-disable no-undef */
const socket = io();

socket.on('countUpdated', count => {
  console.log('Count updated!', count);
});

document.querySelector('#increment').addEventListener('click', () => {
  console.log('Clicked');
  socket.emit('increment');
});
