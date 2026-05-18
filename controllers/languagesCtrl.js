const Language = require('../models/language')
const db = require('../util/database')

exports.getUserLanguages = async (req, res, next) => {
	const user_id = req.params.user_id
	
	try {
		const user = await db.execute(`SELECT * FROM users WHERE id = ?`, [user_id])

		if (!user) {
			return res.status(401).json({
				status: 'failed',
				message: 'Użytkownik nie istnieje.',
			})
		}

		const userLanguages = await Language.get(user_id)

		res.status(201).json({
			status: 'success',
			languages: userLanguages[0],
			userName: user[0][0].user_name,
			message: `Dodane języki pzrez ${user[0][0].user_name} pobrane.`,
		})
	} catch (err) {
		res.status(500).json({
			status: 'error',
			code: 500,
			message: 'Coś poszło nie tak, spróbuj ponownie.',
		})
	}
}

exports.putLanguages = async (req, res, next) => {
	const language_name = req.body.language_name
	const language_id = req.body.language_id
	const language_img_path = req.body.language_img_path
	const user_id = req.body.user_id

	try {
		const user = await db.execute(`SELECT * FROM users WHERE id = ?`, [user_id])
		let duplicatedLanguages = false

		const choosenLanguage = new Language(language_name, language_id, language_img_path, user_id)

		if (!user)
			return res.status(401).json({
				status: 'failed',
				message: 'Użytkownik nie istnieje.',
			})

		const userLanguages = await Language.get(user_id)

		userLanguages[0].forEach(lang => {
			if (lang.language_id === language_id) {
				duplicatedLanguages = true
				return res.status(401).json({
					status: 'failed',
					message: 'Ten język już jest dodany, spróbuj inny.',
				})
			}
		})

		if (!duplicatedLanguages) {
			await choosenLanguage.save()
			res.status(201).json({
				status: 'success',
				language_name,
				language_id,
				language_img_path,
				user_id,
				message: 'Wybrany język został dodany.',
			})
		}
	} catch (err) {
		res.status(500).json({
			status: 'error',
			code: 500,
			message: 'Coś poszło nie tak, spróbuj ponownie.',
		})
	}
}

exports.deleteLanguage = async (req, res, next) => {
	const user_id = req.body.user_id
	const language_id = req.body.language_id

	try {
		const user = await db.execute(`SELECT * FROM users WHERE id = ?`, [user_id])

		if (!user) {
			return res.status(401).json({
				status: 'failed',
				message: 'Użytkownik nie istnieje.',
			})
		}

		const userLanguages = await Language.get(user_id)

		const languageToDelete = userLanguages[0].find(lang => {
			return lang.language_id === language_id
		})

		if (!languageToDelete) {
			return res.status(401).json({
				status: 'failed',
				message: 'Coś poszło nie tak, spróbuj ponownie.',
			})
		}

		await Language.delete(user_id, language_id)

		res.status(201).json({
			status: 'success',
			message: `${language_id} has been deleted successfully from languages created by ${user[0][0].user_name}.`,
		})
	} catch (err) {
		res.status(500).json({
			status: 'error',
			code: 500,
			message: 'Coś poszło nie tak, spróbuj ponownie.',
		})
	}
}
