'use strict';
const roomsCtrl = require('../../database/controllers/rooms');

/*  Creates a new room in the sockets object.

    PARAMS
      sockets (object)
      name (string): name of the room
      password (string): password of the room

    RETURN
      none
*/
const createIfDoesntExistInRAM = (sockets, name) => {
  if (!sockets[name]) {
    sockets[name] = {
      student: { },
      teacher: { }
    }
  }
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
  createIfDoesntExistInRAM,
  doesExistInDb
};
