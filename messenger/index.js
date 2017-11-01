'use strict';

const controllers = require('../database/controllers');
const userManager = require('../websocket/managers/user');
const parser = require('./parser');
const adaptors = require('./adaptors');
const senders = require('./senders');

/*  Send a message from an emitter to a recipient.

    PARAMS
      sockets (object): contains all the active sockets
      user (object): emitter - object from the socket object
      data (object): message to send
      recipient (object): recipient - object from the socket object

    RETURN
      none
*/
const sendMessage = (sockets, user, data, recipient) => {

  // Parsing

  let messages =  parser(data, user, recipient);
  if (messages.length === 0) { return; }

  // Sending

  if (userManager.isStudent(user) && !userManager.isAgent(recipient)
    || userManager.isTeacher(user) && userManager.isHuman(recipient)) {
    messages.forEach(msg => {
      user.socket.emit('message', adaptors.fromUserToUser(msg, user));
      if (recipient) {
        recipient.socket.emit('message', adaptors.fromUserToUser(msg, recipient));
      }
    });
  } else if (userManager.isAgent(user)) {
    messages.forEach(msg => {
      recipient.socket.emit('message', adaptors.fromUserToUser(msg, recipient));
    });
  }

  user.timestamp = messages[messages.length - 1].timestamp;

  // Storing

  if (userManager.isStudent(user) || userManager.isStudent(recipient)) {
    let studentUuid = userManager.isStudent(user) ? user.socket.id : user.recipient;

    messages.forEach(msg => {
      msg.emitterName = user.name;
      msg.room = user.room;
      if (recipient !== null) {
        msg.recipientType = recipient.type;
        msg.recipientName = recipient.name;
      }
      controllers.conversations.addMessage(studentUuid, user.timestamp, msg);
    });
  }
};

module.exports = {
  sendMessage
};
