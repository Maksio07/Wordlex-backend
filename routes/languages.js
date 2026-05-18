const express = require('express')
const router = express.Router()
const langugesCtrl = require('../controllers/languagesCtrl')
const csrfProtection = require('../middleware/csrf')

router.get('/:user_id', csrfProtection, langugesCtrl.getUserLanguages)
router.put('/:user_id', csrfProtection, langugesCtrl.putLanguages)
router.delete('/:user_id', csrfProtection, langugesCtrl.deleteLanguage)

module.exports = router
