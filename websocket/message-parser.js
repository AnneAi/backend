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
  return (/^https:\/\/(www.)?vimeo.com\/(\w*\/)*\d+$/g).test(str);
}

/*  Test if the passed string represents a video url from youtube.

    PARAMS
      str (string): string to check

    RETURN
      (boolean): true if it is video url from youtube, false otherwise
*/
const isYoutubeVideo = str => {
  return (/^https:\/\/(www.)?youtube.com\/(embed\/|watch\?v\=)([A-Za-z0-9]|-)+/g).test(str);
}

/*  Extract parameters from vimeo video url.

    PARAMS
      url (string): url to the video

    RETURN
      (object): contains
        id (string): id of the video
*/
const extractVimeoVideoParameters = url => {
  let params = {};
  params. id = url.substring(url.lastIndexOf('/') + 1);
  return params;
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

    let params = extractVimeoVideoParameters(data.payload);

    msg.payload = {
      platform: 'vimeo',
      id: params.id
    };
  } else if (isYoutubeVideo(data.payload)) {
    msg.type = 'video';
    msg.payload = {
      platform: 'ytb',
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
  isYoutubeVideo,
  extractVimeoVideoParameters,
  parser
};
