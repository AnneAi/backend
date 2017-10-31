'use strict';

/*  Parse a message comming from the agent.

    PARAMS
      raw (object): message from the agent (see dialogflow documentation)

    RETURN
      array of parsed messages
*/
const parse = (raw, user) => {
  if (!raw
    ||!raw.result
    || !raw.result.fulfillment
    || !raw.result.fulfillment.messages) {
    return;
  }

  let messages = raw.result.fulfillment.messages;
  let parsedMsg = [];
  let align = 'left';
  messages.forEach(msg => {
    switch (msg.type) {
      case 0: // text message
        parsedMsg.push({
          emitter: '-1',
          emitterType: 'chatbot',
          recipient: user.socket.id,
          timestamp: new Date(),
          message: {
            type: 'text',
            payload: msg.speech
          }
        });
      break;
    }
  });

  return parsedMsg;
}

module.exports = parse;
