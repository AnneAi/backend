/*  Indicates if a string is empty or only contains space chars.

    PARAMS
      str (string): string to check

    RETURN
      (boolean): true if empty, false otherwise
*/
const isEmpty = str => {
  if (!str || str.length === 0 || !/\S+/.test(str)) {
    return true;
  }
  return false;
};

/*  Test if the passed string represents a video url from vimeo.

    PARAMS
      str (string): string to check

    RETURN
      (boolean): true if it is video url from vimeo, false otherwise
*/
const isVimeoVideo = str => {
  return (/^https:\/\/vimeo.com\/(\w*\/)*\d+$/g).test(str);
}

/*  Parses a message.

    PARAMS
      data (object): message data
      user (object): user information

    RETURN
      (object): parsed message or null if invalid
*/
const parser = (data, user) => {
  if (!data || isEmpty(data.payload)) { return null; }

  let metamsg = {
    emitter: user.socket.id,
    emitterType: user.type,
    recipient: user.recipient,
    timestamp: new Date(),
  };

  let msg = {}
  // Videos
  if (isVimeoVideo(data.payload)) {
    msg.type = 'video';
    msg.payload = {
      platform: 'vimeo',
      id: data.payload.substring(data.payload.lastIndexOf('/') + 1)
    };
  }
  // Text
  else {
    msg.type = 'text';
    msg.payload = data.payload;
  }

  metamsg.message = msg;
  return metamsg;
};

module.exports = {
  isEmpty,
  isVimeoVideo,
  parser
};
