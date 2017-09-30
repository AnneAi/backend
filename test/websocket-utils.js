'use strict';
let utils = require('../websocket/utils');
let expect = require('chai').expect;

describe('websocket/utils', () => {

  it('getUnderloadedTeacherId > should return the if of the most underloaded teacher', () => {
    let sockets = {
      'test': {
        teacher: {
          0: {
            load: 15
          },
          1: {
            load: 20
          },
          2: {
            load: 10
          }
        }
      }
    };

    expect(utils.getUnderloadedTeacherId(sockets, 'test')).to.equal('2');
  });

  it('getUnderloadedTeacherId > should return null', () => {
    let sockets = {
      'test': {
        teacher: { }
      }
    };

    expect(utils.getUnderloadedTeacherId(sockets, 'test')).to.equal(null);
  });

  it('countTeachers > should return the number of connected teachers', () => {
    let sockets = {
      'test': {
        teacher: {
          0: { test: '' },
          1: { test: '' },
          2: { test: '' },
        }
      }
    };

    expect(utils.countTeachers(sockets, 'test')).to.equal(3);
  });
});