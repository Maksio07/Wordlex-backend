const db = require('../util/database')

module.exports = class User {
	constructor(user_name, user_email, user_password, user_keyword) {
		this.user_name = user_name
		this.user_email = user_email
		this.user_password = user_password
		this.user_keyword = user_keyword
	}

	save() {
		return db.execute('INSERT INTO users(user_name, user_email, user_password, user_keyword) VALUES(?, ?, ?, ?)', [
			this.user_name,
			this.user_email,
			this.user_password,
			this.user_keyword,
		])
	}

	static get(user_id) {
		return db.execute(`SELECT * FROM users WHERE id = ?`, [user_id])
	}

	static update(user_id, new_user_name, new_user_email, new_user_password, new_user_keyword) {
		return db.execute(
			`UPDATE users 
         SET user_name = ?, user_email = ?, user_password = ?, user_keyword = ? 
         WHERE id = ?`,
			[new_user_name, new_user_email, new_user_password, new_user_keyword, user_id]
		)
	}
}
