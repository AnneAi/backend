'use strict';
let expect = require('chai').expect;
let adaptor = require('../../../messenger/adaptors/fromUserToUser');

describe('Messenger fromUserToUser adaptor', () => {

  it('should return a valid object', () => {

    let message = {
      emitter: '-1',
      message: {
        type: 'text',
        text: 'what is meaning of life?'
      }
    };

    let user = {
      socket: {
        id: '-1'
      }
    };

    let expected = {
      align: 'right',
      emitter: '-1',
      message: {
        type: 'text',
        text: 'what is meaning of life?'
      }
    };

    expect(adaptor(message, user)).to.deep.equal(expected);
  });
});
