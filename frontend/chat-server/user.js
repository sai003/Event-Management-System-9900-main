/*
NOTE: The code in the file was cloned from the code in the following GitHub Repository:
https://github.com/divofred/ChatTutorial
It was then customised for the EvenTastic Project.
*/
let users = [];

exports.addUser = ({ id, name, room }) => {
  if (!name || !room) return { error: "Username and room are required." };
  const user = { id, name, room };

  users.push(user);

  return { user };
};
exports.removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  return users[index];
};
