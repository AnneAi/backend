'use strict';
let roomManager = require('../../../websocket/managers/room');
let expect = require('chai').expect;

describe('roomManager', () => {
  describe('countTeachers', () => {
    it('should return the number of connected teachers', () => {
      let sockets = {
        0: { type: 'teacher', load: 15, room: 'test', socket: { id: 0 } },
        3: { type: 'student', room: 'test', socket: { id: 3 } },
        2: { type: 'teacher', load: 5, room: 'test', socket: { id: 2 } },
        1: { type: 'teacher', load: 10, room: 'test', socket: { id: 1 } },
      };

      expect(roomManager.countTeachers(sockets, 'test')).to.equal(3);
    });
  });

  describe('getStudents', () => {
    it('should get the list of the students in the specified room', () => {
      let sockets = {
        0: { type: 'teacher', room: 'roomA' },
        2: { type: 'teacher', room: 'roomA' },
        1: { type: 'teacher', room: 'roomA' },
        3: { type: 'student', room: 'roomA' },
        4: { type: 'student', room: 'roomA' },
        5: { type: 'student', room: 'roomB' },
        5: { type: 'student', room: 'roomC' }
      };
      let room = 'roomA';

      let expected = [
        { type: 'student', room: 'roomA' },
        { type: 'student', room: 'roomA' }
      ];

      expect(roomManager.getStudents(sockets, room)).to.deep.equal(expected);
    });
  });
});
