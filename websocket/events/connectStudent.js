const userManager = require('../managers/user');
let sockets = require('../sockets');

const connectStudent = (data, socketId) => {
  let user = userManager.getEmitter(sockets, socketId);
  if (user === null) { return; }

  if (!userManager.isTeacher(user)) { return; }

  let studentId = data.id;
  let student = userManager.getEmitter(sockets, studentId);
  if (student === null) { return; }

  if (student.recipient && student.recipient !== user.socket.id) { return; }

  user.recipient = studentId;
  student.recipient = user.socket.id;

  let msg = { id: studentId };

  user.socket.emit('connect-student', msg);
};

module.exports = connectStudent;
