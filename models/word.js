const db = require('../util/database')

module.exports = class Word {
	constructor(
		word_name,
		word_polish_name,
		word_id,
		word_example,
		word_img_path,
		user_id,
		language_id_int,
		topic_id_int
	) {
		this.word_name = word_name
		this.word_polish_name = word_polish_name
		this.word_id = word_id
		this.word_example = word_example
		this.word_img_path = word_img_path
		this.user_id = user_id
		this.language_id_int = language_id_int
		this.topic_id_int = topic_id_int
	}

	save() {
		return db.execute(
			`INSERT INTO words(word_name, word_polish_name, word_id, word_example, word_img_path, user_id, language_id, topic_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				this.word_name,
				this.word_polish_name,
				this.word_id,
				this.word_example,
				this.word_img_path,
				this.user_id,
				this.language_id_int,
				this.topic_id_int,
			]
		)
	}

	static getLanguageINTId(user_id, language_id) {
		return db.execute(`SELECT id FROM languages WHERE user_id = ? AND language_id = ?`, [user_id, language_id])
	}

	static getTopicINTId(user_id, language_id_int, topic_id) {
		return db.execute(`SELECT id FROM topics WHERE language_id = ? AND user_id = ? AND topic_id = ?`, [
			language_id_int,
			user_id,
			topic_id,
		])
	}

	static getUserTopics(user_id, language_id_int) {
		return db.execute(`SELECT * FROM topics WHERE user_id = ? AND language_id = ?`, [user_id, language_id_int])
	}

	static get(user_id, language_id_int, topic_id_int) {
		return db.execute(`SELECT * FROM words WHERE user_id = ? AND language_id = ? AND topic_id = ?`, [
			user_id,
			language_id_int,
			topic_id_int,
		])
	}

	static update(
		new_word_name,
		new_word_polish_name,
		new_word_example,
		new_word_img_path,
		new_word_id,
		user_id,
		language_id_int,
		topic_id_int,
		word_id
	) {
		return db.execute(
			`UPDATE words
         SET word_name = ?,
             word_polish_name = ?,
             word_example = ?,
             word_img_path = ?,
             word_id = ?
         WHERE user_id = ? 
           AND language_id = ? 
           AND topic_id = ? 
           AND word_id = ?`,
			[
				new_word_name,
				new_word_polish_name,
				new_word_example,
				new_word_img_path,
				new_word_id,

				user_id,
				language_id_int,
				topic_id_int,
				word_id,
			]
		)
	}

	static delete(user_id, language_id_int, topic_id_int, word_id) {
		return db.execute(`DELETE FROM words WHERE user_id = ? AND language_id = ? AND topic_id = ? AND word_id = ?`, [
			user_id,
			language_id_int,
			topic_id_int,
			word_id,
		])
	}
}
