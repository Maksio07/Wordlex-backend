const express = require('express')
const router = express.Router()
const { nameValidator } = require('../util/validation')
const csrfProtection = require('../middleware/csrf')
const worsdCtrl = require('../controllers/wordsCtrl')

router.get('/:user_id/:language_id/:topic_id', worsdCtrl.getUserWords)
router.put('/:user_id/:language_id/:topic_id', csrfProtection, nameValidator, worsdCtrl.putWords)
router.post('/:user_id/:language_id/:topic_id', csrfProtection, nameValidator, worsdCtrl.editWords)
router.delete('/:user_id/:language_id/:topic_id', csrfProtection, worsdCtrl.deleteWords)

module.exports = router
