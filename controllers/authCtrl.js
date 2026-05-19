const db = require('../util/database')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { SECRET_ACCESS_TOKEN } = require('../config/index')

exports.signup = async (req, res, next) => {
	const user_name = req.body.user_name
	const user_email = req.body.user_email
	const user_password = req.body.user_password
	const user_keyword = req.body.user_keyword

	try {
		const salt = await bcrypt.genSalt(12)
		const hashedPassword = await bcrypt.hash(user_password, salt)
		const hashedKeyword = await bcrypt.hash(user_keyword, salt)

		const user = new User(user_name, user_email, hashedPassword, hashedKeyword)

		const emails = await db.execute('SELECT user_email FROM users')
		const existingUser = emails[0].find(email => email.user_email === user_email)

		if (existingUser) {
			return res.status(400).json({
				status: 'failed',
				message: 'Użytkownik z takim emailem już istnieje.',
			})
		}

		await user.save()

		res.send({
			status: 'success',
			message: 'Twoje konto zostało utworzone pomyślnie.',
			name: user.user_name,
			email: user.user_email,
			password: user.user_password,
			keyword: user.user_keyword,
		})
	} catch (err) {
		res.status(500).json({
			status: 'error',
			code: 500,
			message: 'Coś poszło nie tak, spróbuj ponownie.',
		})
	}
}

exports.login = async (req, res) => {
	const user_email = req.body.user_email
	const user_password = req.body.user_password

	try {
		const users = await db.execute('SELECT * FROM users')
		const user = users[0].find(u => u.user_email === user_email)

		if (!user) {
			return res.status(401).json({
				status: 'failed',
				message: 'Taki email nie istnieje.',
			})
		}

		const isPasswordMatches = await bcrypt.compare(user_password, user.user_password)

		if (!isPasswordMatches) {
			return res.status(401).json({
				status: 'failed',
				message: 'Hasło nie jest poprawne.',
			})
		}

		req.session.isLoggedin = true
		req.session.user = user

		req.session.save(err => {
			if (err) {
				return res.status(500).json({ status: 'error', message: 'Session save failed.' })
			}
		})

		const token = jwt.sign(
			{
				email: user_email,
				password: user_password,
			},
			SECRET_ACCESS_TOKEN,
			{ expiresIn: '1h' }
		)

		res.cookie('token', token, {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
			// secure: false,
			// sameSite: 'lax',
			maxAge: 60 * 60 * 1000,
		})

		res.status(201).json({
			status: 'success',
			message: 'Jesteś zalogowany/-a.',
			id_int: user.id,
			name: user.user_name,
			email: user.user_email,
			token,
		})
	} catch (err) {
		res.status(500).json({
			status: 'error',
			code: 500,
			message: 'Coś poszło nie tak, spróbuj ponownie.',
		})
	}
}

exports.logout = (req, res) => {
	if (!req.session) {
		return res.status(200).json({ status: 'success', message: 'Jesteś już wylogowany-/a.' })
	}

	req.session.destroy(err => {
		if (err) {
			return res.status(500).json({
				status: 'error',
				message: 'Failed to destroy session',
			})
		}

		const cookieOptions = {
			httpOnly: true,
			secure: false,
			sameSite: 'lax',
			path: '/',
		}

		res.clearCookie('token', cookieOptions)

		res.clearCookie('login_session', cookieOptions)

		return res.status(200).json({
			status: 'success',
			message: 'Jesteś wylogowany-/a.',
		})
	})
}

exports.forgotPassword = async (req, res, next) => {
	const user_email = req.body.user_email
	const user_keyword = req.body.user_keyword

	try {
		const users = await db.execute('SELECT user_email, user_keyword FROM users')
		const user = users[0].find(u => u.user_email === user_email)

		if (!user) {
			return res.status(401).json({
				status: 'failed',
				message: 'Email nie istnieje.',
			})
		}

		const isKeywordsMatch = await bcrypt.compare(user_keyword, user.user_keyword)

		if (!isKeywordsMatch) {
			return res.status(401).json({
				status: 'failed',
				message: 'Podane kluczowe słowo nie istnieje.',
			})
		}

		const token = jwt.sign({ user_keyword, user_email }, SECRET_ACCESS_TOKEN, { expiresIn: 60 * 3 })
		const resetLink = `/${token}`
		// `https://wordlex-words.netlify.app/auth/reset-password/${token}`
		// `http://localhost:3000/reset-password/${token}`

		res.status(201).json({
			status: 'success',
			message: 'Link do zmiany hasła został wysłany',
			resetLink,
			resetToken: token,
		})
	} catch (err) {
		return res.status(500).json({
			status: 'error',
			code: 500,
			message: 'Coś poszło nie tak, spróbuj ponownie.',
		})
	}
}

exports.resetPassword = async (req, res, next) => {
	const token = req.body.token
	const user_newPassword = req.body.userNewPasword

	try {
		const { user_keyword, user_email } = jwt.verify(token, SECRET_ACCESS_TOKEN)

		const users = await db.execute('SELECT user_email FROM users')
		const user = users[0].find(u => u.user_email === user_email)

		if (!user) {
			return res.status(401).json({
				status: 'failed',
				message: 'Email nie istnieje.',
			})
		}

		const salt = await bcrypt.genSalt(12)
		const hashedPassword = await bcrypt.hash(user_newPassword, salt)
		await db.execute(`UPDATE users SET user_password = ? WHERE user_email = ?`, [hashedPassword, user.user_email])

		res.status(201).json({
			status: 'success',
			message: 'Hasło zostało zmienione pomyślnie.',
		})
	} catch (err) {
		return res.status(500).json({
			status: 'error',
			code: 500,
			message: 'Coś poszło nie tak, spróbuj ponownie.',
		})
	}
}
