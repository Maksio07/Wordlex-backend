const db = require('../util/database')
const Word = require('../models/word')

exports.getUserWords = async (req, res, next) => {
	const user_id = req.params.user_id
	const language_id = req.params.language_id
	const topic_id = req.params.topic_id

	try {
		const language_id_int = await Word.getLanguageINTId(user_id, language_id)
		const topic_id_int = await Word.getTopicINTId(user_id, language_id_int[0][0].id, topic_id)
		const userTopicWords = await Word.get(user_id, language_id_int[0][0].id, topic_id_int[0][0].id)
		const topicData = await db.execute(
			`SELECT * FROM topics WHERE topic_id = ? AND id = ?`, [topic_id, topic_id_int[0][0].id]
		)

		res.status(201).json({
			status: 'success',
			words: userTopicWords[0],
			language_id,
			topic_id,
			language_id_int: language_id_int[0][0].id,
			topic_id_int: topic_id_int[0][0].id,
			topicData: topicData[0][0],
			message: `Words added by user with id ${user_id} from the topic ${topic_id} have been downloaded successfully.`,
		})
	} catch (err) {
		res.status(500).json({
			status: 'error',
			code: 500,
			message: 'Something was wrong.',
		})
	}
}

exports.putWords = async (req, res, next) => {
	const word_name = req.body.word_name
	const word_polish_name = req.body.word_polish_name
	const word_id = req.body.word_id
	const word_example = req.body.word_example || null
	const word_img_path = req.body.word_img_path || null
	const topic_id = req.body.topic_id
	const user_id = req.body.user_id
	const language_id_int = req.body.language_id_int
	const topic_id_int = req.body.topic_id_int

	try {
		const userTopics = await Word.getUserTopics(user_id, language_id_int)
		const userTopic = userTopics[0].find(topic => topic.topic_id === topic_id)

		if (!userTopic) {
			return res.status(401).json({
				status: 'failed',
				message: 'Something was wrong, please try again.',
			})
		}

		const newWord = new Word(
			word_name,
			word_polish_name,
			word_id,
			word_example,
			word_img_path,
			user_id,
			language_id_int,
			topic_id_int
		)

		await newWord.save()

		res.status(201).json({
			status: 'success',
			word_name,
			word_polish_name,
			word_example,
			word_img_path,
			message: `Word ${word_name} has been added successfully to the topic ${topic_id}.`,
		})
	} catch (err) {
		res.status(500).json({
			status: 'error',
			code: 500,
			message: 'Something was wrong.',
		})
	}
}

exports.editWords = async (req, res, next) => {
	const new_word_name = req.body.new_word_name
	const new_word_polish_name = req.body.new_word_polish_name
	const new_word_id = req.body.new_word_id
	const new_word_example = req.body.new_word_example || null
	const new_word_img_path = req.body.new_word_img_path || null
	const user_id = req.body.user_id
	const language_id_int = req.body.language_id_int
	const topic_id_int = req.body.topic_id_int
	const word_id = req.body.word_id

	try {
		const userWords = await Word.get(user_id, language_id_int, topic_id_int)

		const wordToEdit = userWords[0].find(word => {
			return word.word_id === word_id
		})

		if (!wordToEdit) {
			return res.status(401).json({
				status: 'failed',
				message: 'Something was wrong, please try again.',
			})
		}

		wordToEdit.word_name = new_word_name
		wordToEdit.word_polish_name = new_word_polish_name
		wordToEdit.word_example = new_word_example || null
		wordToEdit.word_img_path = new_word_img_path || null
		wordToEdit.word_id = new_word_id

		await Word.update(
			new_word_name,
			new_word_polish_name,
			new_word_example,
			new_word_img_path,
			new_word_id,
			user_id,
			language_id_int,
			topic_id_int,
			word_id
		)

		res.status(201).json({
			status: 'success',
			new_word_name,
			new_word_polish_name,
			new_word_id,
			new_word_example,
			new_word_img_path,
			word_id_int: wordToEdit.id,
			message: `The word ${new_word_name} has been successfully updated.`,
		})
	} catch (err) {
		res.status(500).json({
			status: 'error',
			code: 500,
			message: 'Something was wrong.',
		})
	}
}

exports.deleteWords = async (req, res, next) => {
	const word_id = req.body.word_id
	const topic_id_int = req.body.topic_id_int
	const language_id_int = req.body.language_id_int
	const user_id = req.body.user_id

	try {
		const userWords = await Word.get(user_id, language_id_int, topic_id_int)
		const wordToDelete = userWords[0].find(word => word.word_id === word_id)

		if (!wordToDelete) {
			return res.status(401).json({
				status: 'failed',
				message: 'Something was wrong, please try again.',
			})
		}

		await Word.delete(user_id, language_id_int, topic_id_int, word_id)

		res.status(201).json({
			status: 'success',
			message: `The word ${word_id} has been successfully deleted.`,
		})
	} catch (err) {
		console.log(err);
		res.status(500).json({
			status: 'error',
			code: 500,
			message: 'Something was wrong.',
		})
	}
}
