const db = require('../util/database')
const Topic = require('../models/topic')

exports.getUserTopics = async (req, res, next) => {
	const user_id = req.params.user_id
	const language_id = req.params.language_id

	try {
		const language_id_int = await db.execute(`SELECT id FROM languages WHERE language_id = ? AND user_id = ?`, [
			language_id,
			user_id,
		])
		const userLanguageTopics = await Topic.get(user_id, language_id_int[0][0].id)
		const user = await db.execute(`SELECT user_name FROM users WHERE id = ?`, [user_id])
		const topicWords = await db.execute(`SELECT id, topic_id FROM words WHERE user_id = ? AND language_id = ?`, [
			user_id,
			language_id_int[0][0].id,
		])

		res.status(201).json({
			status: 'success',
			topics: userLanguageTopics[0],
			topicWords: topicWords[0],
			language_id: language_id_int[0][0].id,
			message: `Dodane tematy przez ${user[0][0].user_name} są pobrane.`,
		})
	} catch (err) {
		res.status(500).json({
			status: 'error',
			code: 500,
			message: 'Coś poszło nie tak, spróbuj ponownie.',
		})
	}
}

exports.insertTopic = async (req, res, next) => {
	const topic_name = req.body.topic_name
	const topic_polish_name = req.body.topic_polish_name
	const topic_id = req.body.topic_id
	const user_id = req.body.user_id
	const language_id_int = req.body.language_id_int

	try {
		const newTopic = new Topic(topic_name, topic_polish_name, topic_id, user_id, language_id_int)
		const userLanguageTopics = await Topic.get(user_id, language_id_int)
		const isTopicExists = userLanguageTopics[0].find(topic => topic.topic_name === topic_name)

		if (isTopicExists) {
			return res.status(401).json({
				status: 'failed',
				message: `Temat o nazwie ${topic_name} już istnieje, spróbuj inną nazwę.`,
			})
		}

		await newTopic.save()

		res.status(201).json({
			status: 'success',
			topicName: newTopic.topic_name,
			topicPolishName: newTopic.topic_polish_name,
			topicId: newTopic.topic_id,
			message: `Temat ${topic_name} został dodany.`,
		})
	} catch (err) {
		res.status(500).json({
			status: 'error',
			code: 500,
			message: 'Coś poszło nie tak, spróbuj ponownie.',
		})
	}
}

exports.editTopic = async (req, res, next) => {
	const new_topic_name = req.body.new_topic_name
	const new_topic_polish_name = req.body.new_topic_polish_name
	const new_topic_id = req.body.new_topic_id
	const topic_id = req.body.topic_id
	const user_id = req.body.user_id
	const language_id_int = req.body.language_id_int

	try {
		const userLanguageTopics = await Topic.get(user_id, language_id_int)
		const topicToEdit = userLanguageTopics[0].find(topic => topic.topic_id === topic_id)

		if (!topicToEdit) {
			return res.status(401).json({
				status: 'failed',
				message: 'Temat nie istnieje.',
			})
		}

		const isTopicExists = userLanguageTopics[0].find(topic => topic.topic_name === new_topic_name)

		if (isTopicExists) {
			return res.status(401).json({
				status: 'failed',
				message: `Temat o nazwie ${new_topic_name} już istnieje, spróbuj z inną nazwą.`,
			})
		}

		topicToEdit.topic_name = new_topic_name
		topicToEdit.topic_polish_name = new_topic_polish_name
		topicToEdit.topic_id = new_topic_id

		await Topic.update(user_id, language_id_int, topic_id, new_topic_name, new_topic_polish_name, new_topic_id)

		res.status(201).json({
			status: 'success',
			new_topic_name,
			new_topic_polish_name,
			new_topic_id,
			topic_id_int: topicToEdit.id,
			message: `Temat ${new_topic_name} zaktualizowany.`,
		})
	} catch (err) {
		res.status(500).json({
			status: 'error',
			code: 500,
			message: 'Coś poszło nie tak, spróbuj ponownie.',
		})
	}
}
exports.deleteTopic = async (req, res, next) => {
	const user_id = req.body.user_id
	const language_id_int = req.body.language_id_int
	const topic_id = req.body.topic_id

	try {
		const userLanguageTopics = await Topic.get(user_id, language_id_int)
		const topicToDelete = userLanguageTopics[0].find(topic => topic.topic_id === topic_id)

		if (!topicToDelete) {
			return res.status(401).json({
				status: 'failed',
				message: 'Temat nie istnieje.',
			})
		}

		await Topic.delete(user_id, language_id_int, topic_id)

		res.status(201).json({
			status: 'success',
			message: `Temat z identyfikatorem ${topic_id} został usunięty.`,
		})
	} catch (err) {
		res.status(500).json({
			status: 'error',
			code: 500,
			message: 'Coś poszło nie tak, spróbuj ponownie.',
		})
	}
}
