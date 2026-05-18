const db = require('../util/database')

module.exports = class Topic {
	constructor(topic_name, topic_polish_name, topic_id, user_id, language_id_int) {
		this.topic_name = topic_name
		this.topic_polish_name = topic_polish_name
		this.topic_id = topic_id
		this.user_id = user_id
		this.language_id_int = language_id_int
	}

	save() {
		return db.execute(
			'INSERT INTO topics(topic_name, topic_polish_name, topic_id, user_id, language_id) VALUES(?, ?, ?, ?, ?)',
			[this.topic_name, this.topic_polish_name, this.topic_id, this.user_id, this.language_id_int]
		)
	}

	static get(user_id, language_id_int) {
		return db.execute(`SELECT * FROM topics WHERE user_id = ? AND language_id = ?`, [user_id, language_id_int])
	}

	static update(user_id, language_id_int, topic_id, new_topic_name, new_topic_polish_name, new_topic_id) {
		return db.execute(
			`UPDATE topics 
			SET topic_name = ?, topic_polish_name = ?, topic_id = ?
			WHERE user_id = ? AND language_id = ? AND topic_id = ?`,
			[new_topic_name, new_topic_polish_name, new_topic_id, user_id, language_id_int, topic_id]
		)
	}

	static delete(user_id, language_id_int, topic_id) {
		return db.execute(`DELETE FROM topics WHERE topic_id = ? AND user_id = ? AND language_id = ?`, [
			topic_id,
			user_id,
			language_id_int,
		])
	}
}
