'use strict';
const waitinglist = require('../models').waitinglist;

/*  Add a waiter to the waiting list.

    PARAMS
      name (string): name of the waiter
      email (string): email of the waiter
      phone (string): phone of the waiter
      message (string): message of the waiter
      callback (function) - optional parameter

    RETURN
      none
*/
const addWaiter = (name, email, phone, message, callback) => {
  if (typeof callback === 'undefined') { callback = () => { }; }

  return waitinglist
  .create({
    name: name,
    email: email,
    phone: phone,
    message: message
  })
  .then(() => callback())
  .catch(err => console.error(err))
};

module.exports = {
  addWaiter
};
