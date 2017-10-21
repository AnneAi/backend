const controllers = require('../../database/controllers');
const userManager = require('../managers/user');
const parser = require('../message-parser');
let sockets = require('../sockets');

const message = (data, socketId) => {
  let user = userManager.getEmitter(sockets, socketId);
  if (user === null) { return; }

  let recipient = userManager.getEmitter(sockets, user.recipient);
  if (userManager.isTeacher(user) && recipient === null) { return; }

  let msg = parser(data, user);
  if (msg === null) { return; }

  user.socket.emit('message', msg);
  if (recipient !== null) { recipient.socket.emit('message', msg); }

  let studentUuid = userManager.isStudent(user) ? user.socket.id : user.recipient;

  user.timestamp = msg.timestamp;
  controllers.conversations.addMessage(studentUuid, user.timestamp, msg);
};

module.exports = message;
