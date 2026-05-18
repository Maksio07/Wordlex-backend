const db = require('../util/database')

module.exports = class Language {
	constructor(language_name, language_id, language_img_path, user_id) {
		this.language_name = language_name
		this.language_id = language_id
		this.language_img_path = language_img_path
		this.user_id = user_id
	}

	save() {
		return db.execute(
			'INSERT INTO languages(language_name, language_id, language_img_path, user_id) VALUES(?, ?, ?, ?)',
			[this.language_name, this.language_id, this.language_img_path, this.user_id]
		)
	}

	static get(user_id) {
		return db.execute(
			`SELECT l.id, l.language_name, l.language_img_path, l.language_id 
                FROM users AS u 
                LEFT JOIN languages AS l ON u.id = l.user_id 
                WHERE u.id = ?`,
			[user_id]
		)
	}

	static delete(user_id, language_id) {
		return db.execute(`DELETE FROM languages WHERE language_id = ? AND user_id = ?`, [language_id, user_id])
	}
}
