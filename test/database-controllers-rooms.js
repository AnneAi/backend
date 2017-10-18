'use strict';
let roomsCtrl = require('../database/controllers/rooms');
let expect = require('chai').expect;

describe('database/controllers/rooms', () => {

  it('find > should find the room named TEST', (done) => {
    let testRoom = {
      name: 'TEST',
      password: '',
      teachers: []
    };

    roomsCtrl.create(testRoom.name, testRoom.password, testRoom.teachers, () => {
      roomsCtrl.find(testRoom.name, room => {
        roomsCtrl.delete(testRoom.name, () => {
          expect(room).to.not.equal(null);
          done();
        });
      });
    });
  });

  it('find > should not find the room named TEST', (done) => {
    let name = 'TEST';

    roomsCtrl.find(name, room => {
      expect(room).to.equal(null);
      done();
    });
  });
});
