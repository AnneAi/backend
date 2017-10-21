const roomManager = require('../managers/room');
const userManager = require('../managers/user');
const mailer = require('../../utils/mailer');
let sockets = require('../sockets');

const init = (socket, decryptedToken) => {
  roomManager.doesExistInDb(decryptedToken.roomId, room => {
    if (room === null) { return; }

    sockets[socket.id] = {
      name: decryptedToken.userName,
      type: decryptedToken.type,
      room: decryptedToken.roomId,
      socket: socket
    };
    let user = sockets[socket.id];
    socket.emit('init', { id: socket.id });

    let nbTeachers = roomManager.countTeachers(sockets, user.room);
    if (userManager.isStudent(user)) {
      if (nbTeachers === 0) {

        let mailData = {
          roomName: user.room ,
          studentName: user.name
        };

        mailer.sendMail(room.teachers, 'new-student', mailData);
      } else {
        userManager.connectToUnderloadedTeacher(sockets, user);
      }
    } else if (userManager.isTeacher(user)) {
      user.load = 0;

      if (nbTeachers === 1) {
        Object.keys(sockets).forEach(socketId => {
          let u = userManager.getEmitter(sockets, socketId);
          if (u.room === user.room && userManager.isStudent(u)) {
            userManager.connectToUnderloadedTeacher(sockets, u);
          }
        });
      }
    }
  });
};

module.exports = init;
