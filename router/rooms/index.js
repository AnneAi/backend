let router = require('express').Router();

const create = require('./create');
const deleteRoom = require('./deleteRoom');
const connectStudent = require('./connectStudent');
const connectTeacher = require('./connectTeacher');

router.post('/connect/student', connectStudent);
router.post('/connect/teacher', connectTeacher);
router.post('/create', create);
router.post('/delete', deleteRoom);

module.exports = router;
