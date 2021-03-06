'use strict';

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
};

/*  Test if the passed string represents a video url from youtube.

    PARAMS
      str (string): string to check

    RETURN
      (boolean): true if it is video url from youtube, false otherwise
*/
const isYoutubeVideo = str => {
  return (/^https:\/\/(www.)?youtube.com\/(embed\/|watch\?v\=)([A-Za-z0-9]|-)+/g).test(str);
};

/*  Extract parameters from vimeo video url.

    PARAMS
      url (string): url to the video

    RETURN
      (object): contains
        id (string): id of the video
*/
const extractVimeoVideoParameters = url => {
  let params = {};

  params.id = url.substring(url.lastIndexOf('/') + 1);

  return params;
};

/*  Extract parameters from youtube video url.

    PARAMS
      url (string): url to the video

    RETURN
      (object): contains
        id (string): id of the video
*/
const extractYoutubeVideoParameters = url => {
  let params = {
    id: null,
    start: null,
    end: null
  };

  // Extract video id
  if ((/embed\//g).test(url)) {
    let begin = url.indexOf('embed/') + 6;
    let end = url.lastIndexOf('?');
    if (end === -1) end = url.length;

    params.id = url.substring(begin, end);
  } else if ((/watch\?v\=/g).test(url)) {
    let begin = url.indexOf('watch?v=') + 8;
    let end = url.indexOf('&');
    if (end === -1) end = url.length;

    params.id = url.substring(begin, end);
  }

  // Extract start parameter
  if ((/start\=/g).test(url)) {
    let begin = url.indexOf('start=') + 6;
    let end = url.lastIndexOf('&');
    if (end < begin) end = url.length;

    params.start = url.substring(begin, end);
  }

  // Extract end parameter
  if ((/end\=/g).test(url)) {
    let begin = url.indexOf('end=') + 4;
    let end = url.lastIndexOf('&');
    if (end < begin) end = url.length;

    params.end = url.substring(begin, end);
  }

  return params;
};

/*  Parse a text message.

    PARAMS
      text (string): text to parse

    RETURN
      (object): message that can be

      > text

      type (string): equals 'text'
      text (string): text message

      > video

      type (string): equals 'video'
      url (string): url to the video
*/
const parseText = (text) => {

  let msg = { };

  // Videos
  if (isVimeoVideo(text)) {
    msg.type = 'video';

    let params = extractVimeoVideoParameters(text);

    msg.url = `https://player.vimeo.com/video/${params.id}`;
  } else if (isYoutubeVideo(text)) {
    msg.type = 'video';

    let params = extractYoutubeVideoParameters(text);

    msg.url = `https://www.youtube.com/embed/${params.id}?`;
    if (params.start) msg.url += `&start=${params.start}`;
    if (params.end) msg.url += `&end=${params.end}`;
  }

  // Text
  else {
    msg.type = 'text';
    msg.text = text;
  }

  return msg;
};

module.exports = {
  isEmpty,
  isVimeoVideo,
  isYoutubeVideo,
  extractVimeoVideoParameters,
  extractYoutubeVideoParameters,
  parseText
};
