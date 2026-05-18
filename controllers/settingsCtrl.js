const db = require('../util/database')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

exports.getUserData = async (req, res, next) => {
	const user_id = req.params.user_id

	try {
		const user = await User.get(user_id)

		if (!user) {
			return res.status(401).json({
				status: 'failed',
				message: 'Something was wrong.',
			})
		}

		const userWords = await db.execute(
			`SELECT id, language_id, EXTRACT(YEAR FROM date_created) AS year, EXTRACT(MONTH FROM date_created) AS month, WEEK(date_created, 3) AS week_nr FROM words WHERE user_id = ?`,
			[user_id]
		)

		if (!userWords) {
			return res.status(401).json({
				status: 'failed',
				message: 'Something was wrong.',
			})
		}

		const userLanguages = await db.execute(`SELECT id, language_id, language_name FROM languages WHERE user_id = ?`, [
			user_id,
		])

		if (!userLanguages) {
			return res.status(401).json({
				status: 'failed',
				message: 'Something was wrong.',
			})
		}

		res.status(201).json({
			status: 'success',
			user_name: user[0][0].user_name,
			user_email: user[0][0].user_email,
			user_password: user[0][0].user_password,
			user_keyword: user[0][0].user_keyword,
			userWords: userWords[0],
			userLanguages: userLanguages[0],
			message: `${user[0][0].user_name}'s data has been downloaded successfully.`,
		})
	} catch (err) {
		res.status(500).json({
			status: 'error',
			code: 500,
			message: 'Something was wrong.',
		})
	}
}

exports.updateUser = async (req, res, next) => {
	const user_id = req.body.user_id
	const new_user_name = req.body.new_user_name
	const new_user_email = req.body.new_user_email
	const new_user_password = req.body.new_user_password
	const new_user_keyword = req.body.new_user_keyword

	try {
		const userArr = await User.get(user_id)
		const user = userArr[0][0]

		if (!user) {
			return res.status(401).json({
				status: 'failed',
				message: 'Something was wrong.',
			})
		}

		if (user.user_password === new_user_password) {
			user.user_password = new_user_password
		} else {
			const hashedPassword = await bcrypt.hash(new_user_password, 12)
			user.user_password = hashedPassword
		}

		if (user.user_keyword === new_user_keyword) {
			user.user_keyword = new_user_keyword
		} else {
			const hashedKeyword = await bcrypt.hash(new_user_keyword, 12)
			user.user_keyword = hashedKeyword
		}

		user.user_name = new_user_name
		user.user_email = new_user_email

		await User.update(user_id, new_user_name, new_user_email, user.user_password, user.user_keyword)

		res.status(201).json({
			status: 'success',
			message: `${user.user_name}'s data has been updated successfully.`,
		})
	} catch (err) {
		res.status(500).json({
			status: 'error',
			code: 500,
			message: 'Something was wrong.',
		})
	}
}

exports.deleteUser = async (req, res, next) => {
	const user_id = req.body.user_id

	try {
		if (!req.session) {
			return res.status(200).json({ status: 'success', message: 'Already logged out' })
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
		})

		const result = await db.execute(`DELETE FROM users WHERE id = ?`, [user_id])

		if (!result) {
			return res.status(401).json({
				status: 'failed',
				message: 'Something was wrong.',
			})
		}

		res.status(201).json({
			status: 'success',
			message: `Account has been deleted successfully.`,
		})
	} catch (err) {
		res.status(500).json({
			status: 'error',
			code: 500,
			message: 'Something was wrong.',
		})
	}
}
