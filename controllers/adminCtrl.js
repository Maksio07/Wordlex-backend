const db = require('../util/database')
const User = require('../models/user')
const Admin = require('../models/admin')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { SECRET_ACCESS_TOKEN } = require('../config/index')

exports.loginAdmin = async (req, res, next) => {
    const admin_email = req.body.admin_email
	const admin_password = req.body.admin_password

	try {
		const admins = await db.execute('SELECT * FROM admins')
		const admin = admins[0].find(a => a.admin_email === admin_email)

		if (!admin) {
			return res.status(401).json({
				status: 'failed',
				message: 'Email does not exist.',
			})
		}

		const isPasswordMatches = await bcrypt.compare(admin_password, admin.admin_password)

		if (!isPasswordMatches) {
			return res.status(401).json({
				status: 'failed',
				message: 'Password is not correct, try again.',
			})
		}

		req.session.isLoggedin = true
		req.session.admin = admin
		const token = jwt.sign(
			{
				email: admin_email,
				password: admin_password,
			},
			SECRET_ACCESS_TOKEN,
			{ expiresIn: '1h' }
		)

		res.status(201).json({
			status: 'success',
			message: 'Jesteś zalogowany.',
			id_int: admin.id,
			name: admin.user_name,
			email: admin.user_email,
			// csrfToken: req.csrfToken()
			token,
		})
	} catch (err) {
		res.status(500).json({
			status: 'error',
			code: 500,
			message: 'Something was wrong.',
		})
	}
}

exports.getUsers = async (req, res, next) => {
    try{
        const users = await db.execute('SELECT * FROM users')
        const admins = await Admin.get()

        res.status(201).json({
			status: 'success',
            users: users[0],
            admins: admins[0],
			message: 'Users and admins have been downloaded successfully.',
		})
    } catch (err) {
		res.status(500).json({
			status: 'error',
			code: 500,
			message: 'Something was wrong.',
		})
	}
}

exports.deleteUsers = async (req, res, next) => {
    const user_id = req.body.user_id

    try{
        const userToDelete = await User.get(user_id)

        if(!userToDelete) {
            return res.status(401).json({
				status: 'failed',
				message: `User with ${user_id} does not exist.`,
			})
        }

        await db.execute(`DELETE FROM users WHERE id = ${user_id}`)
        
         res.status(201).json({
			status: 'success',
			message: `User with id ${user_id} has been deleted successfully.`,
		})
    } catch (err) {
		res.status(500).json({
			status: 'error',
			code: 500,
			message: 'Something was wrong.',
		})
	}
}

exports.createNewAdmin = async (req, res, next) => {
    const admin_name = req.body.admin_name
	const admin_email = req.body.admin_email
	const admin_password = req.body.admin_password
	const admin_keyword = req.body.admin_keyword

	try {
		const hashedPassword = await bcrypt.hash(admin_password, 12)
		const hashedKeyword = await bcrypt.hash(admin_keyword, 12)

		const admin = new Admin(admin_name, admin_email, hashedPassword, hashedKeyword)

		const emails = await db.execute('SELECT admin_email FROM admins')
		const existingAdmin = emails[0].find(email => email.admin_email === admin_email)

		if (existingAdmin) {
			return res.status(400).json({
				status: 'failed',
				message: `Admin with email ${existingAdmin} exists.`,
			})
		}

		await admin.save()

		res.send({
			status: 'success',
			message: 'Your acount has been created successfully.',
			name: admin.admin_name,
			email: admin.admin_email,
			password: admin.admin_password,
			keyword: admin.admin_keyword,
		})
	} catch (err) {
		res.status(500).json({
			status: 'error',
			code: 500,
			message: 'Something was wrong.',
		})
	}
}

