const express = require('express')
const router = express.Router()
const csrfProtection = require('../middleware/csrf')
const { nameValidator, emailValidator, passwordValidator, confirmPasswordValidator } = require('../util/validation')
const settingsCtrl = require('../controllers/settingsCtrl')

router.get('/:user_id/settings', settingsCtrl.getUserData)

router.post(
	'/:user_id/settings',
	csrfProtection,
	nameValidator,
	emailValidator,
	passwordValidator,
	confirmPasswordValidator,
	settingsCtrl.updateUser
)

router.delete('/:user_id/settings', csrfProtection, settingsCtrl.deleteUser)

module.exports = router
