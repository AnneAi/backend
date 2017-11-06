'use strict';
const roomsCtrl = require('../../database/controllers/rooms');
const userManager = require('./user');

/*  Returns the number of connected teachers in a room.

    PARAMS
      sockets (object)
      room (string): name of the room

    RETURN
      (number): the number of connected teachers in the room
*/
const countTeachers = (sockets, room) => {
  let counter = 0;
  Object.keys(sockets).forEach(socketId => {
    let user = sockets[socketId];
    if (userManager.isTeacher(user) && user.room === room) {
      counter++;
    }
  });
  return counter;
};

/*  Returns the connected students in a room.

    PARAMS
      sockets (object)
      room (string): name of the room

    RETURN
      (array of object): the connected students in the room
*/
const getStudents = (sockets, room) => {
  let studentsList = [ ];

  Object.keys(sockets).forEach(key => {
    let user = sockets[key];
    if (userManager.isStudent(user) && userManager.isInRoom(user, room)) {
      studentsList.push(user);
    }
  });

  return studentsList;
};

/*  Retrieves a room from the database.

    PARAMS
      name (string): name of the room
      callback (function): called once the room is retrieved. Can take 1 argument:
        room (object): room retrieved from the database. Null if not found

    RETURN
      none
*/
const doesExistInDb = (name, callback) => {
  roomsCtrl.find(name, room => {
    callback(room);
  });
};

module.exports = {
  countTeachers,
  getStudents,
  doesExistInDb
};
