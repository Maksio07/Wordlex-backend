const express = require('express')
const router = express.Router()
const csrfProtection = require('../middleware/csrf')
const {
	emailValidator,
	nameValidator,
	passwordValidator,
	confirmPasswordValidator,
	keywordValidator,
} = require('../util/validation')

const authCtrl = require('../controllers/authCtrl')

router.get('/csrf-token', csrfProtection, (req, res) => {
	res.json({ csrfToken: req.csrfToken() })
})

router.get('/profile/me', (req, res) => {
	if (req.session.isLoggedin) {
		return res.json({ user: req.session.user })
	} else {
		return res.status(401).json({ message: 'You are not authentificated.' })
	}
})

router.put(
	'/signup',
	emailValidator,
	nameValidator,
	passwordValidator,
	confirmPasswordValidator,
	keywordValidator,
	authCtrl.signup
)

router.post('/login', csrfProtection, emailValidator, passwordValidator, authCtrl.login)

router.post('/logout', csrfProtection, authCtrl.logout)

router.post('/forgot-password', csrfProtection, keywordValidator, authCtrl.forgotPassword)
router.post('/reset-password', csrfProtection, passwordValidator, authCtrl.resetPassword)

module.exports = router
