'use strict';

const controllers = require('../database/controllers');
const userManager = require('../websocket/managers/user');
const parsers = require('./parsers');

const messenger = (sockets, user, data) => {
  let recipient = userManager.getEmitter(sockets, user.recipient);
  if (userManager.isTeacher(user) && recipient === null) { return; }

  let msg = parsers.platform.parser(data, user);
  if (msg === null) { return; }

  user.socket.emit('message', msg);
  if (recipient !== null) { recipient.socket.emit('message', msg); }

  let studentUuid = userManager.isStudent(user) ? user.socket.id : user.recipient;

  user.timestamp = msg.timestamp;

  msg.emitterName = user.name;
  msg.room = user.room;
  if (recipient !== null) {
    msg.recipientType = recipient.type;
    msg.recipientName = recipient.name;
  }

  controllers.conversations.addMessage(studentUuid, user.timestamp, msg);
};

module.exports = messenger;
