const users = [];

const addUser = ({ id, username, room }) => {
  // eslint-disable-next-line
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate the data
  if (!username || !room) {
    return {
      error: 'Username and room are required!',
    };
  }

  // Check for existing User

  const existingUser = users.find(user => {
    return user.room === room && user.username === username;
  });

  // validade username

  if (existingUser) {
    return {
      error: 'Username is in use!',
    };
  }

  // store user

  const user = { id, username, room };

  users.push(user);

  return { user };
};

// eslint-disable-next-line consistent-return
const removeUser = id => {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = id => {
  const user = users.find(gUser => gUser.id === id);

  return user;
};

const getUsersInRoom = room => {
  room = room.trim().toLowerCase();
  const usersRoom = users.filter(getRoom => getRoom.room === room);

  return usersRoom;
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
