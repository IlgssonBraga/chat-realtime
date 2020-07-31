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

const removeUser = id => {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

addUser({
  id: 1,
  username: 'Ilgsson',
  room: '1',
});

console.log(users);

removeUser(1);

console.log(users);
