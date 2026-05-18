const { check } = require('express-validator')

exports.emailValidator = check('email')
	.isEmail()
	.withMessage('Podany email nie odpowiada formatowi tekst@tekst.domena.')
	.normalizeEmail()

exports.nameValidator = check('name')
	.not()
	.isEmpty()
	.isLength({ min: 2 })
	.withMessage('Pole z imeniem nie może być puste.')
	.trim()
	.escape()

exports.passwordValidator = check('password')
	.notEmpty()
	.isLength({ min: 8 })
	.withMessage('Hasło powinno zawierać przynajmniej jedną dużą literę, znak specjalny, cyfrę oraz conajmniej 8 znaków.')

exports.confirmPasswordValidator = check('confirmPassword')
	.notEmpty()
	.isLength({ min: 8 })
	.equals()
	.custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error('Passwords have to match!')
		}
	})
	.withMessage('Hasła powinny być takie same.')

exports.keywordValidator = check('keyword')
	.not()
	.isEmpty()
	.isLength({ min: 4 })
	.withMessage('Pole z imeniem nie może być puste.')
	.trim()
	.escape()