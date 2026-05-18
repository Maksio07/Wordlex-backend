const express = require('express')
const router = express.Router()
const csrfProtection = require('../middleware/csrf')
const topicsCtrl = require('../controllers/topicsCtrl')
const { nameValidator } = require('../util/validation')

router.get('/:user_id/:language_id', topicsCtrl.getUserTopics)
router.put('/:user_id/:language_id', csrfProtection, nameValidator, topicsCtrl.insertTopic)
router.post('/:user_id/:language_id', csrfProtection, nameValidator, topicsCtrl.editTopic)
router.delete('/:user_id/:language_id', csrfProtection, topicsCtrl.deleteTopic)

module.exports = router
