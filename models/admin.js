const db = require('../util/database')

module.exports = class Admin {
	constructor(admin_name, admin_email, admin_password, admin_keyword) {
		this.admin_name = admin_name
		this.admin_email = admin_email
		this.admin_password = admin_password
		this.admin_keyword = admin_keyword
	}

	save() {
		return db.execute('INSERT INTO admins(admin_name, admin_email, admin_password, admin_keyword) VALUES(?, ?, ?, ?)', [
			this.admin_name,
			this.admin_email,
			this.admin_password,
			this.admin_keyword,
		])
	}

	static get() {
		return db.execute(`SELECT * FROM admins`)
	}

	static update(admin_id, new_admin_name, new_admin_email, new_admin_password, new_admin_keyword) {
		return db.execute(
			`UPDATE admins SET admin_name = '${new_admin_name}', admin_email = '${new_admin_email}', admin_password = '${new_admin_password}', admin_keyword = '${new_admin_keyword}' WHERE id = ${admin_id}`
		)
	}
}
