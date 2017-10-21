const userManager = require('../managers/user');
let sockets = require('../sockets');

const typingIndicatorHandler = (socketId, evt) => {
  let user = userManager.getEmitter(sockets, socketId);
  if (user === null) { return; }

  let recipient = userManager.getEmitter(sockets, user.recipient);
  if (recipient === null) { return; }

  let msg = {
    emitter: socketId
  };

  recipient.socket.emit(evt, msg);
};

module.exports = typingIndicatorHandler;
